# Thekua E-commerce Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   - If using local MongoDB: Make sure MongoDB service is running
   - If using MongoDB Atlas: Update the connection string in `config.js`

4. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Authentication Flow

### 1. User Registration (Sign Up)
- User visits `/login` page
- Clicks "Sign Up" tab
- Fills in: Name, Email, Password, Confirm Password
- System validates input and creates user in MongoDB
- JWT token is generated and stored in localStorage
- User is redirected to home page

### 2. User Login
- User visits `/login` page
- Fills in: Email, Password
- System validates credentials against MongoDB
- JWT token is generated and stored in localStorage
- User is redirected to home page

### 3. Protected Routes
- All user-specific pages require authentication
- JWT token is sent in Authorization header
- Backend validates token before allowing access

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/cart` - Get user cart
- `PUT /api/user/cart` - Update user cart
- `GET /api/user/orders` - Get user orders
- `POST /api/user/orders` - Create new order

## Database Schema

### User Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  mobile: String,
  dob: Date,
  avatar: String,
  orders: [OrderSchema],
  cart: [CartItemSchema],
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation using express-validator
- CORS configuration
- Secure password requirements (min 6 characters)

## Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `config.js`
   - Verify database name is correct

2. **Port Already in Use:**
   - Change PORT in `config.js`
   - Kill existing process using the port

3. **Authentication Issues:**
   - Check JWT secret in `config.js`
   - Verify token is being sent in Authorization header
   - Check token expiration (7 days default)

## Development Notes

- Backend runs on port 5000
- Frontend runs on port 3000
- MongoDB runs on port 27017 (default)
- All API calls include proper error handling
- User data is stored securely in MongoDB
- JWT tokens expire after 7 days
