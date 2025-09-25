// frontend/lib/api.ts
const API_BASE_URL = "https://shikhathekua-1.onrender.com/api";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("thekua_token") ||
      localStorage.getItem("adminToken")
    );
  }
  return null;
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "API call failed");
  }
  return data;
};

// Named export: apiRequest
export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API Request Failed");
  }

  return res.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  // Admin login (for admin panel)
  adminLogin: async (email: string, password: string) => {
    return apiCall("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signup: async (name: string, email: string, password: string) => {
    return apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  verify: async () => apiCall("/auth/verify"),
};

// User API
export const userAPI = {
  getProfile: async () => apiCall("/user/profile"),
  updateProfile: async (profileData: any) =>
    apiCall("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
  getCart: async () => apiCall("/user/cart"),
  updateCart: async (cart: any) =>
    apiCall("/user/cart", { method: "PUT", body: JSON.stringify({ cart }) }),
  getOrders: async () => apiCall("/user/orders"),
  createOrder: async (orderData: any) =>
    apiCall("/user/orders", {
      method: "POST",
      body: JSON.stringify({ orderData }),
    }),
};

// Health check
export const healthCheck = async () => apiCall("/health");
