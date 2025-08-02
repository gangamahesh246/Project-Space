import axios from "axios";
import store from "../store";
import { logoutStudent } from "../slices/studentAuthSlice";

const axiosStudent = axios.create({
  baseURL: import.meta.env.VITE_Base_URL,
});

axiosStudent.interceptors.request.use(
  (config) => {
    const token = store.getState().student?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosStudent.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logoutStudent());
      window.location.href = "/studentlogin";
    }
    return Promise.reject(err);
  }
);

export default axiosStudent;
