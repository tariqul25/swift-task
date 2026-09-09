import axios from 'axios';
import { auth } from '../firebase/firebase.config';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://swift-tasks-server.vercel.app';

const axiosSecure = axios.create({
  baseURL,
  withCredentials: true,
});

// Single request interceptor attaching fresh Firebase ID token
axiosSecure.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth?.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Failed to get token for secure request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
