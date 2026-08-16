import axios from 'axios';

// For Android emulator pointing to localhost, you need 10.0.2.2 instead of localhost
// Or if you use physical device on same wifi, your IP (e.g. 192.168.x.x)
const API_URL = 'http://10.0.2.2:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

export default api;
