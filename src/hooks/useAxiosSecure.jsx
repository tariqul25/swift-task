import axios from 'axios';
import useAuth from './useAuth';
import { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  axiosSecure.interceptors.request.use( config => {
    if(user){
      config.headers.authorization = `Bearer ${user.idToken}`
    }
    return config;
  },
    (error) => {
      return Promise.reject(error);
    });

  return axiosSecure;
};

export default useAxiosSecure;
