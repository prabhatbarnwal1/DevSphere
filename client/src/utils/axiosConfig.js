import axios from "axios";

const API_BASE_URL = "https://devsphere-server-srn8.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      // Clear both tokens when refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user-storage");
      return null;
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user-storage");
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup") ||
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/logout")
    ) {
      return config;
    }
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        const currentPath = window.location.pathname;
        if (!["/login", "/signup"].includes(currentPath)) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
