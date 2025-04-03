import axios from "axios";
import { API_URL } from "@/config/url";
import { headers } from "next/headers";

// Tạo một instance của axios
const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Biến lưu trạng thái refresh token đang chạy
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm lưu token vào localStorage hoặc SecureStore
const saveToken = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};

// Hàm lấy token từ localStorage hoặc SecureStore
const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Hàm gọi API refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // Lấy refresh token từ storage
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { headers: { "x-token": refreshToken } }
    );

    const newAccessToken = response.data.data.accesstoken;
    saveToken(newAccessToken);


    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
};

// Thêm interceptor cho request
api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor cho response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và request chưa được thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Kiểm tra nếu đang ở trang /login thì KHÔNG refresh token
      if (window.location.pathname === "/login") {
        console.warn("401 tại /login, không refresh token.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        console.log("Token nhận được sau refresh::", newAccessToken);
        if (!newAccessToken) {
          throw new Error("Refresh token expired");
        }

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
