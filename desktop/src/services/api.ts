import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const defaultBaseURL = isLocalhost 
  ? `http://${window.location.hostname}:8000/api` 
  : `https://${window.location.hostname}/api`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

// Request interceptor to add the auth token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401, not retried yet, and it's NOT the login request itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/token/')) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Try to refresh token
          const res = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (res.status === 200) {
            localStorage.setItem('access_token', res.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (err) {
          // Refresh token failed, clear everything
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.reload(); // Force reload to trigger AuthContext to require login
        }
      } else {
        // No refresh token, clear access token just in case
        localStorage.removeItem('access_token');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
