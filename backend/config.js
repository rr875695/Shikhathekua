module.exports = {
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/thekua',
  
  // JWT Secret Key
  JWT_SECRET: process.env.JWT_SECRET || 'thekua_super_secret_key_2024_secure_authentication',
  
  // Server Port
  PORT: process.env.PORT || 5000,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development'
};