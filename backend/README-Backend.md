# Thekua Backend API

A complete backend API for the Thekua website with MongoDB authentication and user management.

## Features

- 🔐 **User Authentication** (Signup/Login with JWT)
- 👤 **User Profile Management**
- 🛒 **Shopping Cart Management**
- 📦 **Order Management**
- 🗄️ **MongoDB Database Integration**
- 🔒 **Password Hashing with bcrypt**
- ✅ **Input Validation**
- 🌐 **CORS Enabled**

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install MongoDB
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service
- Or use MongoDB Atlas (cloud database)

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/thekua
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Shopping Cart
- `GET /api/user/cart` - Get user's cart
- `PUT /api/user/cart` - Update user's cart

### Orders
- `GET /api/user/orders` - Get user's orders
- `POST /api/user/orders` - Create new order

### Health Check
- `GET /api/health` - Server health check

## API Usage Examples

### Signup
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "+91 9876543210",
  "dob": "1990-01-01"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Update Profile
```javascript
PUT /api/user/profile
Authorization: Bearer <jwt_token>
{
  "name": "John Smith",
  "mobile": "+91 9876543210",
  "dob": "1990-01-01"
}
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  mobile: String,
  dob: Date,
  avatar: String,
  orders: [Order],
  cart: [CartItem],
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS protection
- Environment variable configuration

## Frontend Integration

The frontend should make API calls to:
- Base URL: `http://localhost:5000/api`
- Include JWT token in Authorization header: `Bearer <token>`
- Handle authentication state properly

## Development

- Server runs on port 5000 by default
- MongoDB runs on port 27017 by default
- Hot reload enabled in development mode
- Comprehensive error handling and logging



