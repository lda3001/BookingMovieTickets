import apiClient from '@/lib/api/axios';
import { Movie } from '@/types/api';

export const movieService = {
  // Lấy tất cả phim
  getAllMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies');
    return response.data;
  },

  // Lấy phim đang hoạt động
  getActiveMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/active');
    return response.data;
  },

  // Lấy phim đang chiếu
  getNowShowingMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/now-showing');
    return response.data;
  },

  // Lấy phim sắp chiếu
  getComingSoonMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/coming-soon');
    return response.data;
  },

  // Lấy phim theo ID
  getMovieById: async (id: number): Promise<Movie | null> => {
    try {
      const response = await apiClient.get<Movie>(`/movies/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Lấy phim theo slug
  getMovieBySlug: async (slug: string): Promise<Movie | null> => {
    try {
      const response = await apiClient.get<Movie>(`/movies/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Tạo phim mới
  createMovie: async (movie: Partial<Movie>): Promise<Movie> => {
    const response = await apiClient.post<Movie>('/movies', movie);
    return response.data;
  },

  // Cập nhật phim
  updateMovie: async (id: number, movie: Partial<Movie>): Promise<Movie> => {
    const response = await apiClient.put<Movie>(`/movies/${id}`, movie);
    return response.data;
  },

  // Xóa phim
  deleteMovie: async (id: number): Promise<void> => {
    await apiClient.delete(`/movies/${id}`);
  },

  // Lấy phim theo khoảng ngày phát hành
  getMoviesByReleaseDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies/release-date', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Lấy phim theo năm phát hành
  getMoviesByReleaseYear: async (year: number): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>(`/movies/release-year/${year}`);
    return response.data;
  },
};

