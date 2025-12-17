package com.galaxycinema.controller;

import com.galaxycinema.entity.Movie;
import com.galaxycinema.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "API quản lý phim")
public class MovieController {
    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Lấy tất cả phim", description = "Trả về danh sách tất cả các phim trong hệ thống")
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy phim đang hoạt động", description = "Trả về danh sách các phim đang hoạt động")
    public ResponseEntity<List<Movie>> getActiveMovies() {
        return ResponseEntity.ok(movieService.getActiveMovies());
    }

    @GetMapping("/now-showing")
    @Operation(summary = "Lấy phim đang chiếu", description = "Trả về danh sách các phim đang được chiếu")
    public ResponseEntity<List<Movie>> getNowShowingMovies() {
        return ResponseEntity.ok(movieService.getNowShowingMovies());
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Lấy phim sắp chiếu", description = "Trả về danh sách các phim sắp được chiếu")
    public ResponseEntity<List<Movie>> getComingSoonMovies() {
        return ResponseEntity.ok(movieService.getComingSoonMovies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy phim theo ID", description = "Trả về thông tin chi tiết của một phim theo ID")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Lấy phim theo slug", description = "Trả về thông tin chi tiết của một phim theo slug")
    public ResponseEntity<Movie> getMovieBySlug(@PathVariable String slug) {
        return movieService.getMovieBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Tạo phim mới", description = "Tạo một phim mới trong hệ thống")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.createMovie(movie));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật phim", description = "Cập nhật thông tin của một phim")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.updateMovie(id, movie));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phim", description = "Xóa (vô hiệu hóa) một phim khỏi hệ thống")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/release-date")
    @Operation(summary = "Lấy phim theo khoảng ngày phát hành", description = "Trả về danh sách phim trong khoảng ngày phát hành")
    public ResponseEntity<List<Movie>> getMoviesByReleaseDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(movieService.getMoviesByReleaseDateRange(startDate, endDate));
    }

    @GetMapping("/release-year/{year}")
    @Operation(summary = "Lấy phim theo năm phát hành", description = "Trả về danh sách phim phát hành trong năm cụ thể")
    public ResponseEntity<List<Movie>> getMoviesByReleaseYear(@PathVariable int year) {
        return ResponseEntity.ok(movieService.getMoviesByReleaseYear(year));
    }
}

