import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add JWT token to Authorization header if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 expired/invalid token response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Dispatch event to update UI instantly
      window.dispatchEvent(new Event('auth-updated'));
      
      // Prevent infinite redirect loops if already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const cartApi = {
  getCart: () => api.get('/api/cart'),
  addToCart: (productId, quantity, selectedColor) =>
    api.post('/api/cart', {
      productId: Number(productId),
      quantity: Number(quantity),
      selectedColor: selectedColor || 'Default'
    }),
  updateQuantity: (itemId, quantity) =>
    api.put(`/api/cart/item/${itemId}`, {
      quantity: Number(quantity)
    }),
  removeFromCart: (itemId) =>
    api.delete(`/api/cart/item/${itemId}`)
};

