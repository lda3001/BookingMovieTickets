import axios from 'axios';

// Cấu hình axios instance với base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    // Thêm token authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Server trả về lỗi
      const status = error.response.status;
      
      // Nếu lỗi 401 (Unauthorized), xóa token và redirect về trang đăng nhập
      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Có thể redirect về trang login nếu cần
        // window.location.href = '/login';
      }
      
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network Error:', error.request);
    } else {
      // Lỗi khi setup request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

