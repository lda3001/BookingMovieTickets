import type { HttpError } from "@refinedev/core";
import axios from "axios";
import { API_URL } from "./helper";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("user");
            // Có thể redirect về trang login nếu cần
            // window.location.href = "/login";
        }

        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message || error.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    }
);

export { axiosInstance };
