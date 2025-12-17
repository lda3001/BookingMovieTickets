# Galaxy Cinema Booking Backend

Backend API cho hệ thống đặt vé xem phim Galaxy Cinema được xây dựng bằng Spring Boot và MySQL.

## Công nghệ sử dụng

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **Lombok**

## Cấu trúc dự án

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/galaxycinema/
│   │   │   ├── entity/          # Các entity/model
│   │   │   ├── repository/      # Repository layer
│   │   │   ├── service/        # Service layer
│   │   │   ├── controller/     # REST API controllers
│   │   │   └── config/         # Configuration classes
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
├── pom.xml
└── README.md
```

## Cài đặt và chạy

### Yêu cầu

- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Các bước

1. **Clone repository và vào thư mục backend:**
```bash
cd backend
```

2. **Tạo database MySQL:**
```sql
CREATE DATABASE galaxy_cinema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Cấu hình database trong `application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/galaxy_cinema
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. **Chạy schema SQL (tùy chọn):**
```bash
mysql -u root -p galaxy_cinema < src/main/resources/schema.sql
```

5. **Build và chạy ứng dụng:**
```bash
mvn clean install
mvn spring-boot:run
```

Hoặc sử dụng IDE để chạy class `BookingApplication`.

## Swagger UI

Sau khi chạy ứng dụng, bạn có thể truy cập Swagger UI tại:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs (JSON)**: http://localhost:8080/api/api-docs

Swagger UI cung cấp giao diện trực quan để:
- Xem tất cả các API endpoints
- Test các API trực tiếp từ trình duyệt
- Xem request/response schemas
- Xem các tham số và mô tả chi tiết

## API Endpoints

### Movies

- `GET /api/movies` - Lấy tất cả phim
- `GET /api/movies/active` - Lấy phim đang hoạt động
- `GET /api/movies/now-showing` - Lấy phim đang chiếu
- `GET /api/movies/coming-soon` - Lấy phim sắp chiếu
- `GET /api/movies/{id}` - Lấy phim theo ID
- `GET /api/movies/slug/{slug}` - Lấy phim theo slug
- `POST /api/movies` - Tạo phim mới
- `PUT /api/movies/{id}` - Cập nhật phim
- `DELETE /api/movies/{id}` - Xóa phim

### Showtimes

- `GET /api/showtimes/movie/{movieId}` - Lấy lịch chiếu theo phim
- `GET /api/showtimes/movie/{movieId}/cinema/{cinemaId}/date/{date}` - Lấy lịch chiếu theo phim, rạp và ngày
- `GET /api/showtimes/movie/{movieId}/cinema/{cinemaId}/available-dates` - Lấy danh sách ngày có lịch chiếu
- `GET /api/showtimes/{id}` - Lấy lịch chiếu theo ID
- `POST /api/showtimes` - Tạo lịch chiếu mới
- `PUT /api/showtimes/{id}` - Cập nhật lịch chiếu
- `DELETE /api/showtimes/{id}` - Xóa lịch chiếu

### Bookings

- `GET /api/bookings/user/{userId}` - Lấy đặt vé của user
- `GET /api/bookings/code/{bookingCode}` - Lấy đặt vé theo mã
- `POST /api/bookings` - Tạo đặt vé mới
- `POST /api/bookings/{bookingCode}/confirm` - Xác nhận đặt vé
- `POST /api/bookings/{bookingCode}/cancel` - Hủy đặt vé

### Cinemas

- `GET /api/cinemas` - Lấy tất cả rạp
- `GET /api/cinemas/active` - Lấy rạp đang hoạt động
- `GET /api/cinemas/city/{city}` - Lấy rạp theo thành phố
- `GET /api/cinemas/{id}` - Lấy rạp theo ID

## Database Schema

### Các bảng chính:

1. **movies** - Thông tin phim
2. **cinemas** - Thông tin rạp chiếu phim
3. **rooms** - Thông tin phòng chiếu
4. **seats** - Thông tin ghế ngồi
5. **showtimes** - Lịch chiếu phim
6. **users** - Thông tin người dùng
7. **bookings** - Đặt vé
8. **booked_seats** - Ghế đã được đặt

## Tính năng

- ✅ Quản lý phim (CRUD)
- ✅ Quản lý rạp chiếu phim
- ✅ Quản lý lịch chiếu
- ✅ Đặt vé và chọn ghế
- ✅ Kiểm tra ghế đã được đặt
- ✅ Quản lý đặt vé
- ✅ CORS configuration cho frontend

## Phát triển tiếp

- [ ] Authentication & Authorization với JWT
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard APIs
- [ ] Search và filter nâng cao
- [ ] Caching với Redis
- [ ] Unit tests và Integration tests

## License

MIT License

