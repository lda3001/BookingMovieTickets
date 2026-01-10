package com.galaxycinema.controller;

import com.galaxycinema.dto.request.ShowtimeRequest;
import com.galaxycinema.dto.response.ShowtimeResponse;
import com.galaxycinema.entity.Showtime;
import com.galaxycinema.entity.Movie;
import com.galaxycinema.entity.Cinema;
import com.galaxycinema.entity.Room;
import com.galaxycinema.repository.MovieRepository;
import com.galaxycinema.repository.CinemaRepository;
import com.galaxycinema.repository.RoomRepository;
import com.galaxycinema.repository.BookedSeatRepository;
import com.galaxycinema.service.ShowtimeService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtimes", description = "API quản lý lịch chiếu phim")
public class ShowtimeController {
    private final ShowtimeService showtimeService;
    private final Mappers mappers;
    private final MovieRepository movieRepository;
    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;
    private final BookedSeatRepository bookedSeatRepository;

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Lấy lịch chiếu theo phim", description = "Trả về danh sách lịch chiếu của một phim")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(mappers.toShowtimeResponseList(showtimeService.getShowtimesByMovie(movieId)));
    }

    @GetMapping("/movie/{movieId}/cinema/{cinemaId}/date/{date}")
    @Operation(summary = "Lấy lịch chiếu theo phim, rạp và ngày", description = "Trả về danh sách lịch chiếu của một phim tại một rạp trong ngày cụ thể")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByMovieAndCinemaAndDate(
            @PathVariable Long movieId,
            @PathVariable Long cinemaId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(mappers.toShowtimeResponseList(
                showtimeService.getShowtimesByMovieAndCinemaAndDate(movieId, cinemaId, date)));
    }

    @GetMapping("/movie/{movieId}/cinema/{cinemaId}/available-dates")
    @Operation(summary = "Lấy danh sách ngày có lịch chiếu", description = "Trả về danh sách các ngày có lịch chiếu cho một phim tại một rạp")
    public ResponseEntity<List<LocalDate>> getAvailableDates(
            @PathVariable Long movieId,
            @PathVariable Long cinemaId) {
        return ResponseEntity.ok(showtimeService.getAvailableDates(movieId, cinemaId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy lịch chiếu theo ID", description = "Trả về thông tin chi tiết của một lịch chiếu")
    public ResponseEntity<ShowtimeResponse> getShowtimeById(@PathVariable Long id) {
        return ResponseEntity.ok(mappers.toShowtimeResponse(showtimeService.getShowtimeById(id)));
    }

    @GetMapping("/{id}/booked-seats")
    @Operation(summary = "Lấy danh sách ghế đã đặt", description = "Trả về danh sách mã ghế đã được đặt cho một lịch chiếu")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Long id) {
        List<String> bookedSeats = bookedSeatRepository.findBookedSeatCodesByShowtimeId(id);
        return ResponseEntity.ok(bookedSeats);
    }

    @PostMapping
    @Operation(summary = "Tạo lịch chiếu mới", description = "Tạo một lịch chiếu mới trong hệ thống")
    public ResponseEntity<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.movieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        Cinema cinema = cinemaRepository.findById(request.cinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        Showtime showtime = Showtime.builder()
                .movie(movie)
                .cinema(cinema)
                .room(room)
                .showTime(request.showTime())
                .endTime(request.endTime())
                .format(request.format())
                .price(request.price())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        
        Showtime savedShowtime = showtimeService.createShowtime(showtime);
        return ResponseEntity.ok(mappers.toShowtimeResponse(savedShowtime));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật lịch chiếu", description = "Cập nhật thông tin của một lịch chiếu")
    public ResponseEntity<ShowtimeResponse> updateShowtime(@PathVariable Long id, @Valid @RequestBody ShowtimeRequest request) {
        Showtime showtime = showtimeService.getShowtimeById(id);
        
        if (request.movieId() != null) {
            Movie movie = movieRepository.findById(request.movieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            showtime.setMovie(movie);
        }
        
        if (request.cinemaId() != null) {
            Cinema cinema = cinemaRepository.findById(request.cinemaId())
                    .orElseThrow(() -> new RuntimeException("Cinema not found"));
            showtime.setCinema(cinema);
        }
        
        if (request.roomId() != null) {
            Room room = roomRepository.findById(request.roomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            showtime.setRoom(room);
        }
        
        if (request.showTime() != null) {
            showtime.setShowTime(request.showTime());
        }
        if (request.endTime() != null) {
            showtime.setEndTime(request.endTime());
        }
        if (request.format() != null) {
            showtime.setFormat(request.format());
        }
        if (request.price() != null) {
            showtime.setPrice(request.price());
        }
        if (request.isActive() != null) {
            showtime.setIsActive(request.isActive());
        }
        
        Showtime updatedShowtime = showtimeService.updateShowtime(id, showtime);
        return ResponseEntity.ok(mappers.toShowtimeResponse(updatedShowtime));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lịch chiếu", description = "Xóa (vô hiệu hóa) một lịch chiếu khỏi hệ thống")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
