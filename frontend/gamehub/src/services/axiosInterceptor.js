import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const currentPath = window.location.pathname;
  
      // 401 SOLO fuera del login
      if (status === 401 && currentPath !== "/login") {
        localStorage.removeItem("token");
        window.location.href = "/welcome";
      }
      return Promise.reject(error);
    }
  );
  
