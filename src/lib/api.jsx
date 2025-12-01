// lib/api.js
import axios from "axios";
import { auth } from "@/config/firebase";



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token only for `api`
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const user = auth.currentUser;

      if (user) {
        try {
          const token = await user.getIdToken(true);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.error("Firebase token error:", err);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      try { await auth.signOut(); } catch {}
      window.location.href = "/hello";
    }

    if (status >= 500) {
      console.error("Server error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default { api };
