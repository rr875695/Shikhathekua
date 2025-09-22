// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("./config");

// === Admin Schema (match server.js) ===
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// === Create Admin Function ===
async function createAdmin() {
  try {
    // Connect to the same database as server.js
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected...");

    const username = "superadmin";
    const email = "admin@thekua.com";
    const password = "Admin@123";

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists with this email:", email);
      return;
    }

    // Create new admin
    const admin = new Admin({ username, email, password });
    await admin.save();

    console.log("🎉 Admin created successfully!");
    console.log(`👉 Username: ${username}`);
    console.log(`👉 Email: ${email}`);
    console.log(`👉 Password: ${password}`);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
