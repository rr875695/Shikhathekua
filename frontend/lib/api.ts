// API utility functions for Thekua backend
const API_BASE_URL = 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('thekua_token')
  }
  return null
}

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// API call wrapper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API call failed')
    }

    return data
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  signup: async (name, email, password) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
  },

  verify: async () => {
    return apiCall('/auth/verify')
  }
}

// User API calls
export const userAPI = {
  getProfile: async () => {
    return apiCall('/user/profile')
  },

  updateProfile: async (profileData) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  getCart: async () => {
    return apiCall('/user/cart')
  },

  updateCart: async (cart) => {
    return apiCall('/user/cart', {
      method: 'PUT',
      body: JSON.stringify({ cart })
    })
  },

  getOrders: async () => {
    return apiCall('/user/orders')
  },

  createOrder: async (orderData) => {
    return apiCall('/user/orders', {
      method: 'POST',
      body: JSON.stringify({ orderData })
    })
  }
}

// Health check
export const healthCheck = async () => {
  return apiCall('/health')
}

