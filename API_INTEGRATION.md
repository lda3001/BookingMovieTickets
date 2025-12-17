# Hướng dẫn tích hợp API với Axios

Đã hoàn thành việc tích hợp API backend với frontend sử dụng axios.

## 📦 Đã cài đặt

- ✅ `axios` - HTTP client library

## 📁 Cấu trúc files đã tạo

```
src/
├── lib/
│   └── api/
│       ├── axios.ts          # Axios instance với cấu hình
│       └── README.md         # Hướng dẫn chi tiết
├── types/
│   └── api.ts                # TypeScript types cho tất cả entities
├── services/
│   ├── movieService.ts       # API service cho Movies
│   ├── showtimeService.ts    # API service cho Showtimes
│   ├── bookingService.ts     # API service cho Bookings
│   ├── cinemaService.ts      # API service cho Cinemas
│   └── index.ts              # Export tất cả services
└── hooks/
    ├── useMovies.ts          # React hooks cho Movies
    ├── useShowtimes.ts       # React hooks cho Showtimes
    ├── useCinemas.ts         # React hooks cho Cinemas
    └── index.ts              # Export tất cả hooks
```

## ⚙️ Cấu hình

### 1. Tạo file `.env.local`

Tạo file `.env.local` trong thư mục gốc và thêm:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Đảm bảo backend đang chạy

Backend cần chạy trên `http://localhost:8080/api` (theo cấu hình trong `application.properties`)

## 🚀 Cách sử dụng

### Cách 1: Sử dụng Services trực tiếp

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
        console.error('Error:', error);
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

### Cách 2: Sử dụng Custom Hooks (Khuyến nghị)

```typescript
'use client';

import { useNowShowingMovies, useComingSoonMovies } from '@/hooks';
import MovieCard from '@/components/MovieCard';

export default function MovieSection() {
  const { movies: nowShowing, loading: loadingNow } = useNowShowingMovies();
  const { movies: comingSoon, loading: loadingComing } = useComingSoonMovies();
  const [tab, setTab] = useState<'now' | 'coming'>('now');

  if (loadingNow || loadingComing) return <div>Loading...</div>;

  return (
    <section>
      {/* Tabs */}
      <div>
        <button onClick={() => setTab('now')}>Đang chiếu</button>
        <button onClick={() => setTab('coming')}>Sắp chiếu</button>
      </div>

      {/* Movie Grid */}
      <div>
        {(tab === 'now' ? nowShowing : comingSoon).map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
}
```

### Ví dụ: Lấy phim theo slug

```typescript
'use client';

import { useMovie } from '@/hooks';

export default function MovieDetailPage({ slug }: { slug: string }) {
  const { movie, loading, error } = useMovie(slug);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      {/* ... */}
    </div>
  );
}
```

### Ví dụ: Lấy lịch chiếu

```typescript
'use client';

import { useShowtimesByMovieAndCinemaAndDate } from '@/hooks';

export default function ShowtimeSelector({ 
  movieId, 
  cinemaId, 
  date 
}: { 
  movieId: number; 
  cinemaId: number; 
  date: string;
}) {
  const { showtimes, loading, error } = useShowtimesByMovieAndCinemaAndDate(
    movieId,
    cinemaId,
    date
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {showtimes.map((showtime) => (
        <div key={showtime.id}>
          {new Date(showtime.showTime).toLocaleTimeString()} - {showtime.format}
        </div>
      ))}
    </div>
  );
}
```

### Ví dụ: Tạo đặt vé

```typescript
'use client';

import { useState } from 'react';
import { bookingService } from '@/services';
import { CreateBookingRequest } from '@/types/api';

export default function BookingForm() {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const request: CreateBookingRequest = {
        userId: 1,
        showtimeId: 1,
        seatCodes: ['A1', 'A2']
      };
      
      const booking = await bookingService.createBooking(request);
      console.log('Booking created:', booking.bookingCode);
      
      // Xác nhận đặt vé
      const confirmed = await bookingService.confirmBooking(booking.bookingCode);
      console.log('Booking confirmed:', confirmed);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleBooking} disabled={loading}>
      {loading ? 'Đang xử lý...' : 'Đặt vé'}
    </button>
  );
}
```

## 📚 API Services có sẵn

### MovieService
- `getAllMovies()` - Lấy tất cả phim
- `getActiveMovies()` - Lấy phim đang hoạt động
- `getNowShowingMovies()` - Lấy phim đang chiếu
- `getComingSoonMovies()` - Lấy phim sắp chiếu
- `getMovieById(id)` - Lấy phim theo ID
- `getMovieBySlug(slug)` - Lấy phim theo slug
- `createMovie(movie)` - Tạo phim mới
- `updateMovie(id, movie)` - Cập nhật phim
- `deleteMovie(id)` - Xóa phim

### ShowtimeService
- `getShowtimesByMovie(movieId)` - Lấy lịch chiếu theo phim
- `getShowtimesByMovieAndCinemaAndDate(movieId, cinemaId, date)` - Lấy lịch chiếu theo phim, rạp và ngày
- `getAvailableDates(movieId, cinemaId)` - Lấy danh sách ngày có lịch chiếu
- `getShowtimeById(id)` - Lấy lịch chiếu theo ID
- `createShowtime(showtime)` - Tạo lịch chiếu mới
- `updateShowtime(id, showtime)` - Cập nhật lịch chiếu
- `deleteShowtime(id)` - Xóa lịch chiếu

### BookingService
- `getUserBookings(userId)` - Lấy đặt vé của user
- `getBookingByCode(bookingCode)` - Lấy đặt vé theo mã
- `createBooking(request)` - Tạo đặt vé mới
- `confirmBooking(bookingCode)` - Xác nhận đặt vé
- `cancelBooking(bookingCode)` - Hủy đặt vé

### CinemaService
- `getAllCinemas()` - Lấy tất cả rạp
- `getActiveCinemas()` - Lấy rạp đang hoạt động
- `getCinemasByCity(city)` - Lấy rạp theo thành phố
- `getCinemaById(id)` - Lấy rạp theo ID

## 🎣 Custom Hooks có sẵn

### useMovies
- `useMovies()` - Lấy tất cả phim
- `useNowShowingMovies()` - Lấy phim đang chiếu
- `useComingSoonMovies()` - Lấy phim sắp chiếu
- `useMovie(slug)` - Lấy phim theo slug

### useShowtimes
- `useShowtimesByMovie(movieId)` - Lấy lịch chiếu theo phim
- `useShowtimesByMovieAndCinemaAndDate(movieId, cinemaId, date)` - Lấy lịch chiếu theo phim, rạp và ngày
- `useAvailableDates(movieId, cinemaId)` - Lấy danh sách ngày có lịch chiếu

### useCinemas
- `useCinemas()` - Lấy rạp đang hoạt động
- `useCinemasByCity(city)` - Lấy rạp theo thành phố

## 🔧 Xử lý lỗi

Tất cả services và hooks đều có xử lý lỗi. Ví dụ:

```typescript
const { movies, loading, error } = useNowShowingMovies();

if (error) {
  return <div>Error: {error}</div>;
}
```

Hoặc với try-catch:

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

## 📝 TypeScript Types

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

## 🔐 Authentication (Tùy chọn)

Nếu cần thêm authentication, uncomment phần code trong `src/lib/api/axios.ts`:

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // ...
);
```

## ✅ Next Steps

1. Tạo file `.env.local` với `NEXT_PUBLIC_API_URL`
2. Đảm bảo backend đang chạy trên port 8080
3. Cập nhật các components hiện tại để sử dụng API thay vì static data
4. Test các API endpoints

## 📖 Tham khảo thêm

Xem file `src/lib/api/README.md` để biết thêm chi tiết về cách sử dụng.

