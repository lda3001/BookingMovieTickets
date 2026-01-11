// TypeScript types cho các entity từ backend

export interface Movie {
  id: number;
  slug: string;
  title: string;
  image?: string;
  duration?: string;
  rating?: string;
  ageRating?: string; // T18, T16, T13, K, P, C16, C13
  releaseDate?: string; // Format: "dd/MM/yyyy"
  country?: string;
  producer?: string;
  genre?: string;
  director?: string;
  cast?: string;
  tagline?: string;
  subtitle?: string;
  trailerUrl?: string;
  content?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  showtimes?: Showtime[];
}

export interface Cinema {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  city?: string;
  totalRooms?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  rooms?: Room[];
  showtimes?: Showtime[];
}

export interface Room {
  id: number;
  name: string;
  cinemaId?: number;
  cinemaName?: string;
  totalRows?: number;
  seatsPerRow?: number;
  vipRows?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Showtime {
  id: number;
  movieId?: number;
  movieTitle?: string;
  movieSlug?: string;
  cinemaId?: number;
  cinemaName?: string;
  roomId?: number;
  roomName?: string;
  movie?: Movie;
  cinema?: Cinema;
  room?: Room;
  showTime: string; // Format: "dd/MM/yyyy HH:mm"
  endTime?: string; // Format: "dd/MM/yyyy HH:mm"
  format?: string; // 2D Phụ đề, 2D Lồng tiếng, IMAX, etc.
  price?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookings?: Booking[];
  bookedSeats?: BookedSeat[];
}

export interface Booking {
  id: number;
  bookingCode: string;
  userId?: number;
  userEmail?: string;
  userFullName?: string;
  showtimeId?: number;
  showTime?: string;
  movieTitle?: string;
  cinemaName?: string;
  roomName?: string;
  seatCodes?: string[];
  user?: User;
  showtime?: Showtime;
  bookedSeats?: BookedSeat[];
  totalPrice?: number;
  status: BookingStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface BookedSeat {
  id: number;
  booking?: Booking;
  showtime?: Showtime;
  seatCode: string;
  createdAt?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Request/Response types
export interface CreateBookingRequest {
  showtimeId: number;
  seatCodes: string[];
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // Format: "dd/MM/yyyy"
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // Format: "dd/MM/yyyy"
  role: UserRole;
}

