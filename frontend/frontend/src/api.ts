import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Authorization: `Bearer <your_token_here>`, // paste your token
    'Content-Type': 'application/json',
  },
});

export default api;
