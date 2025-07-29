import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';

const axiosSecure= axios.create({
    baseURL:"http://localhost:3000"
})
const useAxiosSecure = () => {
    const {user}=useAuth();
    axiosSecure.interceptors.request.use(async config =>{
        if(user){
            const token=await user.getIdToken();
            config.headers.Authorization=`Bearer ${token}`
        }
        return config;
    }),error=>{
        return Promise.reject(error)
    }
    return axiosSecure;
};

export default useAxiosSecure;