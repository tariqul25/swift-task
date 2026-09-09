import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://swift-tasks-server.vercel.app';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;