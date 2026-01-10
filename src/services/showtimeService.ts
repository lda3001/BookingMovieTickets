import apiClient from '@/lib/api/axios';
import { Showtime } from '@/types/api';

export const showtimeService = {
  // Lấy lịch chiếu theo phim
  getShowtimesByMovie: async (movieId: number): Promise<Showtime[]> => {
    const response = await apiClient.get<Showtime[]>(`/showtimes/movie/${movieId}`);
    return response.data;
  },

  // Lấy lịch chiếu theo phim, rạp và ngày
  getShowtimesByMovieAndCinemaAndDate: async (
    movieId: number,
    cinemaId: number,
    date: string // Format: YYYY-MM-DD hoặc LocalDate
  ): Promise<Showtime[]> => {
    const response = await apiClient.get<Showtime[]>(
      `/showtimes/movie/${movieId}/cinema/${cinemaId}/date/${date}`
    );
    return response.data;
  },

  // Lấy danh sách ngày có lịch chiếu
  getAvailableDates: async (
    movieId: number,
    cinemaId: number
  ): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `/showtimes/movie/${movieId}/cinema/${cinemaId}/available-dates`
    );
    return response.data;
  },

  // Lấy lịch chiếu theo ID
  getShowtimeById: async (id: number): Promise<Showtime> => {
    const response = await apiClient.get<Showtime>(`/showtimes/${id}`);
    return response.data;
  },

  // Tạo lịch chiếu mới
  createShowtime: async (showtime: Partial<Showtime>): Promise<Showtime> => {
    const response = await apiClient.post<Showtime>('/showtimes', showtime);
    return response.data;
  },

  // Cập nhật lịch chiếu
  updateShowtime: async (
    id: number,
    showtime: Partial<Showtime>
  ): Promise<Showtime> => {
    const response = await apiClient.put<Showtime>(`/showtimes/${id}`, showtime);
    return response.data;
  },

  // Xóa lịch chiếu
  deleteShowtime: async (id: number): Promise<void> => {
    await apiClient.delete(`/showtimes/${id}`);
  },

  // Lấy danh sách ghế đã đặt của một lịch chiếu
  getBookedSeats: async (showtimeId: number): Promise<string[]> => {
    const response = await apiClient.get<string[]>(`/showtimes/${showtimeId}/booked-seats`);
    return response.data;
  },
};

