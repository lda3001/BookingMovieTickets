import apiClient from '@/lib/api/axios';
import { Room } from '@/types/api';

export const roomService = {
  // Lấy tất cả phòng
  getAllRooms: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },

  // Lấy phòng đang hoạt động
  getActiveRooms: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms/active');
    return response.data;
  },

  // Lấy phòng theo rạp
  getRoomsByCinema: async (cinemaId: number): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>(`/rooms/cinema/${cinemaId}`);
    return response.data;
  },

  // Lấy phòng đang hoạt động theo rạp
  getActiveRoomsByCinema: async (cinemaId: number): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>(`/rooms/cinema/${cinemaId}/active`);
    return response.data;
  },

  // Lấy phòng theo ID
  getRoomById: async (id: number): Promise<Room | null> => {
    try {
      const response = await apiClient.get<Room>(`/rooms/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

