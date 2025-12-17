# API Integration Guide

Hướng dẫn sử dụng API services đã được tích hợp với axios.

## Cấu hình

### Environment Variables

Tạo file `.env.local` trong thư mục gốc của project và thêm:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Nếu không có biến môi trường, mặc định sẽ sử dụng `http://localhost:8080/api`.

## Sử dụng

### Import services

```typescript
import { movieService, showtimeService, bookingService, cinemaService } from '@/services';
// hoặc
import { movieService } from '@/services/movieService';
```

### Ví dụ sử dụng Movie Service

```typescript
'use client';

import { useEffect, useState } from 'react';
import { movieService } from '@/services';
import { Movie } from '@/types/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getNowShowingMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {movies.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
}
```

### Ví dụ sử dụng Showtime Service

```typescript
import { showtimeService } from '@/services';

// Lấy lịch chiếu theo phim
const showtimes = await showtimeService.getShowtimesByMovie(movieId);

// Lấy lịch chiếu theo phim, rạp và ngày
const showtimes = await showtimeService.getShowtimesByMovieAndCinemaAndDate(
  movieId,
  cinemaId,
  '2025-12-15' // Format: YYYY-MM-DD
);

// Lấy danh sách ngày có lịch chiếu
const availableDates = await showtimeService.getAvailableDates(movieId, cinemaId);
```

### Ví dụ sử dụng Booking Service

```typescript
import { bookingService } from '@/services';
import { CreateBookingRequest } from '@/types/api';

// Tạo đặt vé mới
const bookingRequest: CreateBookingRequest = {
  userId: 1,
  showtimeId: 1,
  seatCodes: ['A1', 'A2', 'A3']
};

const booking = await bookingService.createBooking(bookingRequest);

// Xác nhận đặt vé
const confirmedBooking = await bookingService.confirmBooking(booking.bookingCode);

// Hủy đặt vé
await bookingService.cancelBooking(booking.bookingCode);
```

### Ví dụ sử dụng Cinema Service

```typescript
import { cinemaService } from '@/services';

// Lấy tất cả rạp đang hoạt động
const cinemas = await cinemaService.getActiveCinemas();

// Lấy rạp theo thành phố
const hanoiCinemas = await cinemaService.getCinemasByCity('Hà Nội');
```

## Xử lý lỗi

Tất cả các service functions đều có thể throw error. Nên wrap trong try-catch:

```typescript
try {
  const movie = await movieService.getMovieById(1);
} catch (error: any) {
  if (error.response?.status === 404) {
    console.log('Movie not found');
  } else {
    console.error('Error:', error.message);
  }
}
```

## TypeScript Types

Tất cả types được định nghĩa trong `src/types/api.ts`:

- `Movie`
- `Cinema`
- `Showtime`
- `Booking`
- `User`
- `BookedSeat`
- `CreateBookingRequest`
- `BookingStatus` (enum)
- `UserRole` (enum)

