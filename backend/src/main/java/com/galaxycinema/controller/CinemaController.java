package com.galaxycinema.controller;

import com.galaxycinema.entity.Cinema;
import com.galaxycinema.repository.CinemaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
@RequiredArgsConstructor
@Tag(name = "Cinemas", description = "API quản lý rạp chiếu phim")
public class CinemaController {
    private final CinemaRepository cinemaRepository;

    @GetMapping
    @Operation(summary = "Lấy tất cả rạp", description = "Trả về danh sách tất cả các rạp chiếu phim")
    public ResponseEntity<List<Cinema>> getAllCinemas() {
        return ResponseEntity.ok(cinemaRepository.findAll());
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy rạp đang hoạt động", description = "Trả về danh sách các rạp đang hoạt động")
    public ResponseEntity<List<Cinema>> getActiveCinemas() {
        return ResponseEntity.ok(cinemaRepository.findByIsActiveTrue());
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Lấy rạp theo thành phố", description = "Trả về danh sách các rạp trong một thành phố")
    public ResponseEntity<List<Cinema>> getCinemasByCity(@PathVariable String city) {
        return ResponseEntity.ok(cinemaRepository.findByCity(city));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy rạp theo ID", description = "Trả về thông tin chi tiết của một rạp")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable Long id) {
        return cinemaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

