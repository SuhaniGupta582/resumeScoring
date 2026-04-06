import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// ✅ Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});