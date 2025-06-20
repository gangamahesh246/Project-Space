import axios from "axios";
import store from "../store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const adminToken = state.login?.token;

    const studentToken = state.student?.token;

    const token = adminToken || studentToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
