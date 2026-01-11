import apiClient from '@/lib/api/axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

export const authService = {
  // Đăng nhập
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', request);
    return response.data;
  },

  // Đăng ký
  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', request);
    return response.data;
  },

  // Lưu token vào localStorage
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  // Lấy token từ localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Xóa token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Lưu thông tin user
  saveUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Lấy thông tin user
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // Đăng xuất
  logout: () => {
    authService.removeToken();
    if (typeof window !== 'undefined') {
     window.location.href = '/';
    }
  },
};

