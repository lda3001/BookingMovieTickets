package com.galaxycinema.controller;

import com.galaxycinema.entity.Showtime;
import com.galaxycinema.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Lấy lịch chiếu theo phim", description = "Trả về danh sách lịch chiếu của một phim")
    public ResponseEntity<List<Showtime>> getShowtimesByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }

    @GetMapping("/movie/{movieId}/cinema/{cinemaId}/date/{date}")
    @Operation(summary = "Lấy lịch chiếu theo phim, rạp và ngày", description = "Trả về danh sách lịch chiếu của một phim tại một rạp trong ngày cụ thể")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieAndCinemaAndDate(
            @PathVariable Long movieId,
            @PathVariable Long cinemaId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieAndCinemaAndDate(movieId, cinemaId, date));
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
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo lịch chiếu mới", description = "Tạo một lịch chiếu mới trong hệ thống")
    public ResponseEntity<Showtime> createShowtime(@RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.createShowtime(showtime));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lịch chiếu", description = "Cập nhật thông tin của một lịch chiếu")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable Long id, @RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, showtime));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lịch chiếu", description = "Xóa (vô hiệu hóa) một lịch chiếu khỏi hệ thống")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}

