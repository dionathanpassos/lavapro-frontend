import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const publicRoutes = ["/auth/login", "/auth/register"];

    const isPublic = publicRoutes.some((route) => config?.url.endsWith(route));

    if (!isPublic) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      
      toast.error("Sessão expirada, efetue login novamente.", {
        id: "session-expired-toast",
      });

    //   setTimeout(() => {
    //     window.location.href = "/auth/login";
    //   }, 3000);
    }
    return Promise.reject(error);
  },
);
