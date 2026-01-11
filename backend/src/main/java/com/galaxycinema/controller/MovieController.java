package com.galaxycinema.controller;

import com.galaxycinema.dto.request.MovieRequest;
import com.galaxycinema.dto.response.MovieResponse;
import com.galaxycinema.entity.Movie;
import com.galaxycinema.service.MovieService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "API quản lý phim")
public class MovieController {
    private final MovieService movieService;
    private final Mappers mappers;

    @GetMapping
    @Operation(summary = "Lấy tất cả phim", description = "Trả về danh sách tất cả các phim trong hệ thống")
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getAllMovies()));
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy phim đang hoạt động", description = "Trả về danh sách các phim đang hoạt động")
    public ResponseEntity<List<MovieResponse>> getActiveMovies() {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getActiveMovies()));
    }

    @GetMapping("/now-showing")
    @Operation(summary = "Lấy phim đang chiếu", description = "Trả về danh sách các phim đang được chiếu")
    public ResponseEntity<List<MovieResponse>> getNowShowingMovies() {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getNowShowingMovies()));
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Lấy phim sắp chiếu", description = "Trả về danh sách các phim sắp được chiếu")
    public ResponseEntity<List<MovieResponse>> getComingSoonMovies() {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getComingSoonMovies()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy phim theo ID", description = "Trả về thông tin chi tiết của một phim theo ID")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id)
                .map(mappers::toMovieResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Lấy phim theo slug", description = "Trả về thông tin chi tiết của một phim theo slug")
    public ResponseEntity<MovieResponse> getMovieBySlug(@PathVariable String slug) {
        return movieService.getMovieBySlug(slug)
                .map(mappers::toMovieResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Tạo phim mới", description = "Tạo một phim mới trong hệ thống")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        Movie movie = Movie.builder()
                .slug(request.slug())
                .title(request.title())
                .image(request.image())
                .duration(request.duration())
                .rating(request.rating())
                .releaseDate(request.releaseDate())
                .country(request.country())
                .producer(request.producer())
                .genre(request.genre())
                .director(request.director())
                .cast(request.cast())
                .tagline(request.tagline())
                .subtitle(request.subtitle())
                .trailerUrl(request.trailerUrl())
                .content(request.content())
                .description(request.description())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        
        Movie savedMovie = movieService.createMovie(movie);
        return ResponseEntity.ok(mappers.toMovieResponse(savedMovie));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật phim", description = "Cập nhật thông tin của một phim")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieResponse> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        Movie movie = movieService.getMovieById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setTitle(request.title());
        movie.setSlug(request.slug());
        movie.setImage(request.image());
        movie.setDuration(request.duration());
        movie.setRating(request.rating());
        movie.setReleaseDate(request.releaseDate());
        movie.setCountry(request.country());
        movie.setProducer(request.producer());
        movie.setGenre(request.genre());
        movie.setDirector(request.director());
        movie.setCast(request.cast());
        movie.setContent(request.content());
        movie.setDescription(request.description());
        movie.setTrailerUrl(request.trailerUrl());
        if (request.isActive() != null) {
            movie.setIsActive(request.isActive());
        }
        
        Movie updatedMovie = movieService.updateMovie(id, movie);
        return ResponseEntity.ok(mappers.toMovieResponse(updatedMovie));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phim", description = "Xóa (vô hiệu hóa) một phim khỏi hệ thống")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/release-date")
    @Operation(summary = "Lấy phim theo khoảng ngày phát hành", description = "Trả về danh sách phim trong khoảng ngày phát hành")
    public ResponseEntity<List<MovieResponse>> getMoviesByReleaseDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getMoviesByReleaseDateRange(startDate, endDate)));
    }

    @GetMapping("/release-year/{year}")
    @Operation(summary = "Lấy phim theo năm phát hành", description = "Trả về danh sách phim phát hành trong năm cụ thể")
    public ResponseEntity<List<MovieResponse>> getMoviesByReleaseYear(@PathVariable int year) {
        return ResponseEntity.ok(mappers.toMovieResponseList(movieService.getMoviesByReleaseYear(year)));
    }
}
