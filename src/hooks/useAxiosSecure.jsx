import axios from "axios";
import { auth } from "../firebase/firebase.config";
import { signOut } from "firebase/auth";

const baseURL = import.meta.env.VITE_BACKEND_URL || "https://swift-tasks-server.vercel.app";

const axiosSecure = axios.create({
  baseURL,
  withCredentials: true,
});

// Request interceptor: attach fresh Firebase ID token
axiosSecure.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth?.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to get token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-logout on 401 / 403
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        await signOut(auth);
      } catch (_) {}
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;
