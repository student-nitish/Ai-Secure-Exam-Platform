import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { toast } from "sonner";

const BaseUrl = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL:BaseUrl,
  withCredentials: true,
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
  });
};

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  
  res => res,
  err => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
      toast.error("Token Expire Login Again")
    }
    return Promise.reject(err);
  }
);
