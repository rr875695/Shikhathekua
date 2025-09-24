module.exports = {
  // MongoDB Configuration
  MONGODB_URI: "mongodb+srv://rr875695:Ravi%402003@cluster0.bregvnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  
  // JWT Secret Key
  JWT_SECRET: process.env.JWT_SECRET || 'thekua_super_secret_key_2024_secure_authentication',
  
  // Server Port
  PORT: process.env.PORT || 5000,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development'
};
