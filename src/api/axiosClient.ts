import axios from "axios";
import { STORAGE_KEYS } from "@/constants";

// In this project, employeeApi/authApi delegate to a mock service layer
// (see src/services) instead of hitting this baseURL, so the app runs with
// zero backend setup. Point VITE_API_BASE_URL at a real API and swap the
// mock calls in src/api/*.ts for axiosClient calls to go live.
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?sessionExpired=1";
      }
    }
    return Promise.reject(error);
  }
);
