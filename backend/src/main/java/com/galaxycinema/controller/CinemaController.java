package com.galaxycinema.controller;

import com.galaxycinema.dto.request.CinemaRequest;
import com.galaxycinema.dto.response.CinemaResponse;
import com.galaxycinema.entity.Cinema;
import com.galaxycinema.service.CinemaService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
@RequiredArgsConstructor
@Tag(name = "Cinemas", description = "API quản lý rạp chiếu phim")
public class CinemaController {
    private final CinemaService cinemaService;
    private final Mappers mappers;

    @GetMapping
    @Operation(summary = "Lấy tất cả rạp", description = "Trả về danh sách tất cả các rạp chiếu phim")
    public ResponseEntity<List<CinemaResponse>> getAllCinemas() {
        return ResponseEntity.ok(mappers.toCinemaResponseList(cinemaService.getAllCinemas()));
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy rạp đang hoạt động", description = "Trả về danh sách các rạp đang hoạt động")
    public ResponseEntity<List<CinemaResponse>> getActiveCinemas() {
        return ResponseEntity.ok(mappers.toCinemaResponseList(cinemaService.getActiveCinemas()));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Lấy rạp theo thành phố", description = "Trả về danh sách các rạp trong một thành phố")
    public ResponseEntity<List<CinemaResponse>> getCinemasByCity(@PathVariable String city) {
        return ResponseEntity.ok(mappers.toCinemaResponseList(cinemaService.getCinemasByCity(city)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy rạp theo ID", description = "Trả về thông tin chi tiết của một rạp")
    public ResponseEntity<CinemaResponse> getCinemaById(@PathVariable Long id) {
        return cinemaService.getCinemaById(id)
                .map(mappers::toCinemaResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Tạo rạp mới", description = "Tạo một rạp chiếu phim mới trong hệ thống")
    public ResponseEntity<CinemaResponse> createCinema(@Valid @RequestBody CinemaRequest request) {
        Cinema cinema = Cinema.builder()
                .name(request.name())
                .address(request.address())
                .phone(request.phone())
                .city(request.city())
                .totalRooms(request.totalRooms())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        
        Cinema savedCinema = cinemaService.createCinema(cinema);
        return ResponseEntity.ok(mappers.toCinemaResponse(savedCinema));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật rạp", description = "Cập nhật thông tin của một rạp chiếu phim")
    public ResponseEntity<CinemaResponse> updateCinema(@PathVariable Long id, @Valid @RequestBody CinemaRequest request) {
        Cinema cinema = Cinema.builder()
                .name(request.name())
                .address(request.address())
                .phone(request.phone())
                .city(request.city())
                .totalRooms(request.totalRooms())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        
        Cinema updatedCinema = cinemaService.updateCinema(id, cinema);
        return ResponseEntity.ok(mappers.toCinemaResponse(updatedCinema));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa rạp", description = "Xóa (vô hiệu hóa) một rạp chiếu phim khỏi hệ thống")
    public ResponseEntity<Void> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}
