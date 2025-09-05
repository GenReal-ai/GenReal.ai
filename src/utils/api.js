import axios from "axios";

// Point this to your backend Render URL in production
const api = axios.create({
  baseURL:  "http://localhost:3001",
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
