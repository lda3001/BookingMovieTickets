import apiClient from '@/lib/api/axios';
import { Cinema } from '@/types/api';

export const cinemaService = {
  // Lấy tất cả rạp
  getAllCinemas: async (): Promise<Cinema[]> => {
    const response = await apiClient.get<Cinema[]>('/cinemas');
    return response.data;
  },

  // Lấy rạp đang hoạt động
  getActiveCinemas: async (): Promise<Cinema[]> => {
    const response = await apiClient.get<Cinema[]>('/cinemas/active');
    return response.data;
  },

  // Lấy rạp theo thành phố
  getCinemasByCity: async (city: string): Promise<Cinema[]> => {
    const response = await apiClient.get<Cinema[]>(`/cinemas/city/${city}`);
    return response.data;
  },

  // Lấy rạp theo ID
  getCinemaById: async (id: number): Promise<Cinema | null> => {
    try {
      const response = await apiClient.get<Cinema>(`/cinemas/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

