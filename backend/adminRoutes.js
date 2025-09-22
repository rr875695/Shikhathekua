// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// ========== CONFIG ==========
const config = {
  PORT: 5000,
  MONGODB_URI: 'mongodb://127.0.0.1:27017/thekua_db', // replace with your URI
  JWT_SECRET: 'your_jwt_secret_here'
};

// ========== MODELS ==========

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  dob: Date,
  avatar: String,
  orders: [{
    orderId: String,
    items: [{
      id: Number,
      name: String,
      price: Number,
      image: String,
      description: String,
      quantity: Number
    }],
    totalAmount: Number,
    orderDate: String,
    orderTime: String,
    status: String,
    customerDetails: {
      name: String,
      address: String,
      contact: String,
      location: String,
      paymentMethod: String
    }
  }],
  cart: [{
    id: Number,
    name: String,
    price: Number,
    image: String,
    description: String,
    quantity: Number
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Admin Model ---
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// --- Product Model ---
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  stock: Number,
  category: String
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ========== APP SETUP ==========
const app = express();
const PORT = config.PORT;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ========== MONGODB CONNECTION ==========
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ========== JWT HELPERS ==========
const JWT_SECRET = config.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Admin token required' });

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err || admin.role !== 'admin') return res.status(403).json({ message: 'Invalid or expired token' });
    req.admin = admin;
    next();
  });
};

// ========== ROUTES ==========

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Thekua Backend API is running 🚀', status: 'healthy' });
});

// --- USER AUTH ---
app.post('/api/auth/signup', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    res.status(500).json({ message: 'Signup error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// --- ADMIN AUTH ---
app.post('/api/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ adminId: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Admin login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Admin login error' });
  }
});

// --- PRODUCT MANAGEMENT ---
app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ message: 'Product added', product });
});

app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: 'Product updated', product });
});

app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// --- ADMIN ORDER MANAGEMENT ---
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  const users = await User.find().select('name email orders');
  const allOrders = users.flatMap(user =>
    user.orders.map(order => ({ ...order.toObject(), user: { id: user._id, name: user.name, email: user.email } }))
  );
  res.json(allOrders);
});

app.put('/api/admin/orders/:userId/:orderId', authenticateAdmin, async (req, res) => {
  const { userId, orderId } = req.params;
  const { status } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const order = user.orders.id(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await user.save();
  res.json({ message: 'Order status updated', order });
});

// ========== START SERVER ==========
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
module.exports = router; // ✅ Must export the router function

