const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth functions
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

export const resetPassword = async (token, password) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });
  return handleResponse(response);
};

export const verifyEmail = async (token) => {
  const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const resendVerificationEmail = async (email) => {
  const response = await fetch(`${API_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

// Token management
export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Product functions
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

// Cart functions
export const getCart = async () => {
  const token = getToken();
  if (!token) return [];

  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addToCart = async (productId, quantity = 1) => {
  const token = getToken();
  if (!token) throw new Error('Please login to add items to cart');

  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const updateCartItem = async (productId, quantity) => {
  const token = getToken();
  if (!token) throw new Error('Please login to update cart');

  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
};

export const removeFromCart = async (productId) => {
  const token = getToken();
  if (!token) throw new Error('Please login to remove items from cart');

  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Order functions
export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
}

export async function getOrder(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get order');
    }

    return response.json();
}

export async function getOrders() {
    const response = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get orders');
    }

    return response.json();
}

export async function clearCart() {
    const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clear cart');
    }

    return response.json();
} 