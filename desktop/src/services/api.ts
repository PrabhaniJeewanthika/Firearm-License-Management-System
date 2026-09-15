import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const defaultBaseURL = isLocalhost 
  ? `http://${window.location.hostname}:8000/api` 
  : `https://${window.location.hostname}/api`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

export default api;
