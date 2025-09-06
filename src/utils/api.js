import axios from "axios";

// Use environment variable for production URL fallback
const BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // optional: 30s timeout
});

// ✅ Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      // You can handle global 401 logout here if needed
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("authStateChanged", { detail: { isLoggedIn: false } }));
      }
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
