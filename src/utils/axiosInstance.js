import axios from "axios";
import store from "../store";
import { logout } from "../slices/adminAuthSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_Base_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().login?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/isadmin";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
