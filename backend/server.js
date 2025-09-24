// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const config = require('./config');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ========== CONFIG ==========
// Values now sourced from backend/config.js (env-driven)

// ========== APP SETUP ==========
const app = express();
const PORT = config.PORT;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000','https://shikhathekua.onrender.com'], credentials: true }));
app.use(express.json());

// Ensure uploads directory exists and is served static
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// ========== MONGODB CONNECTION ==========
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ========== MODELS ==========

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  mobile: String,
  dob: Date,
  avatar: String,
  orders: [{
    orderId: String,
    items: [{
      id: String,
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
    id: String,
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
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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

// Ensure a default admin exists (dev convenience)
(async () => {
  try {
    const count = await Admin.estimatedDocumentCount();
    if (count === 0) {
      const username = 'superadmin';
      const email = 'admin@thekua.com';
      const password = 'Admin@123';
      await Admin.create({ username, email, password });
      console.log('🔐 Default admin created:', { email, username });
    }
  } catch (e) {
    console.warn('⚠️ Unable to verify/create default admin:', e?.message || e);
  }
})();

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

// --- Order Model (separate collection) ---
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    image: String,
    description: String,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  customerDetails: {
    name: String,
    address: String,
    contact: String,
    location: String,
    paymentMethod: String
  },
  orderDate: String,
  orderTime: String,
  deliveryDate: String
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

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

// ========== UPLOADS (ADMIN) ==========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.post('/api/admin/upload-image', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filename = req.file.filename;
  const relativeUrl = `/uploads/${filename}`;
  res.status(201).json({ message: 'Uploaded', url: relativeUrl });
});

// ========== ROUTES ==========

// Health Check
app.get('/api/health', (req, res) => res.json({ message: 'Thekua Backend API is running 🚀', status: 'healthy' }));

// ----------------- USER ROUTES -----------------

// Signup
app.post('/api/auth/signup', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return res.status(400).json({ message: first?.msg || 'Invalid input', errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.status(201).json({ message: 'User created', token, user: safeUser });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Signup error' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

// Token verify (user)
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Token valid', user });
  } catch (err) {
    res.status(500).json({ message: 'Verify error' });
  }
});

// Profile routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const updateData = req.body;
  const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'Profile updated', user });
});

// Cart
app.get('/api/user/cart', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('cart');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ cart: user.cart || [] });
});

app.put('/api/user/cart', authenticateToken, async (req, res) => {
  const { cart } = req.body;
  const user = await User.findByIdAndUpdate(req.user.userId, { cart: cart || [] }, { new: true }).select('cart');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'Cart updated', cart: user.cart });
});

// Orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
  const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.json({ orders });
});

app.post('/api/user/orders', authenticateToken, async (req, res) => {
  const { orderData } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const newOrder = await Order.create({
    orderId: orderData.id || `ORD${Date.now()}`,
    user: user._id,
    items: orderData.items || [],
    totalAmount: orderData.totalAmount || 0,
    status: orderData.status || 'Pending',
    customerDetails: orderData.customerDetails || {},
    orderDate: orderData.orderDate,
    orderTime: orderData.orderTime,
    deliveryDate: orderData.deliveryDate
  });

  // Clear user's cart after order
  user.cart = [];
  await user.save();

  res.status(201).json({ message: 'Order placed', order: newOrder });
});

// ----------------- ADMIN ROUTES -----------------

// Admin login
app.post('/api/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    console.log('➡️  POST /api/admin/login', { email });
    const admin = await Admin.findOne({ email });
    console.log('🔎 Admin found?', Boolean(admin));
    if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' });

    const ok = await admin.comparePassword(password);
    console.log('🔐 Password match?', ok);
    if (!ok) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign({ adminId: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Admin login successful', token });
  } catch (err) {
    console.error('❌ Admin login error:', err?.message || err);
    console.error(err?.stack || '');
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Admin debug endpoint
app.get('/api/admin/_debug', async (req, res) => {
  try {
    const adminCount = await Admin.estimatedDocumentCount();
    const sample = await Admin.findOne().select('email username createdAt');
    const state = mongoose.connection.readyState; // 1 connected
    res.json({
      mongoConnected: state === 1,
      mongoState: state,
      adminCount,
      sampleAdmin: sample || null
    });
  } catch (e) {
    res.status(500).json({ message: 'Debug error', error: e?.message || e });
  }
});

// Admin product management
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

// Get single product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

// Admin: list users
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  const users = await User.find().select('name email createdAt');
  res.json(users);
});

// Admin: seed default products once
app.post('/api/admin/seed-products', authenticateAdmin, async (req, res) => {
  const defaults = [
    { name: 'Sugar Thekua', price: 150, description: 'Traditional sweet Thekua with sugar', image: '/sugar.jpeg', stock: 100, category: 'Traditional' },
    { name: 'Flavoured Thekua', price: 180, description: 'Thekua with various flavors', image: '/flavour.webp', stock: 80, category: 'Flavoured' },
    { name: 'Mango Thekua', price: 200, description: 'Delicious mango flavored Thekua', image: '/fruit.jpeg', stock: 60, category: 'Fruit' },
    { name: 'Orange Thekua', price: 190, description: 'Tangy orange essence Thekua', image: '/fruit.jpeg', stock: 60, category: 'Fruit' },
    { name: 'Apple Thekua', price: 195, description: 'Sweet apple flavor Thekua', image: '/fruit.jpeg', stock: 60, category: 'Fruit' },
    { name: 'Banana Thekua', price: 185, description: 'Creamy banana taste Thekua', image: '/fruit.jpeg', stock: 60, category: 'Fruit' },
    { name: 'Dry Fruit Thekua', price: 250, description: 'Rich dry fruits Thekua', image: '/dryfruit.jpg', stock: 50, category: 'Premium' },
    { name: 'Cardamom Thekua', price: 170, description: 'Aromatic cardamom Thekua', image: '/cardamom.jpeg', stock: 70, category: 'Spice' },
    { name: 'Coconut Thekua', price: 160, description: 'Tropical coconut Thekua', image: '/coconut.jpg', stock: 70, category: 'Tropical' }
  ];

  let created = 0;
  for (const item of defaults) {
    const exists = await Product.findOne({ name: item.name });
    if (!exists) {
      await Product.create(item);
      created += 1;
    }
  }
  res.json({ message: 'Seed completed', created });
});

// Admin order management (from separate collection)
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

app.put('/api/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Order status updated', order });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
