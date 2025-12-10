// lib/apiClient.js
import axios from "axios";
import { auth } from "@/config/firebase";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined") {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error("Auth token error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      try { await auth.signOut(); } catch {}
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default apiClient;
