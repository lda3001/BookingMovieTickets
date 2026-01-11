import apiClient from '@/lib/api/axios';
import { Booking, CreateBookingRequest } from '@/types/api';

export const bookingService = {
  // Lấy đặt vé của user
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/bookings/user`);
    return response.data;
  },

  // Lấy đặt vé theo mã
  getBookingByCode: async (bookingCode: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/code/${bookingCode}`);
    return response.data;
  },

  // Tạo đặt vé mới
  createBooking: async (request: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', request);
    return response.data;
  },

  // Xác nhận đặt vé
  confirmBooking: async (bookingCode: string, paymentMethod: string): Promise<Booking> => {
    const response = await apiClient.post<Booking>(
      `/bookings/${bookingCode}/confirm?paymentMethod=${paymentMethod}`
    );
    return response.data;
  },

  // Hủy đặt vé
  cancelBooking: async (bookingCode: string): Promise<void> => {
    await apiClient.post(`/bookings/${bookingCode}/cancel`);
  },
};

