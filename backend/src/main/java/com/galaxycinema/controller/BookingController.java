package com.galaxycinema.controller;

import com.galaxycinema.dto.request.BookingRequest;
import com.galaxycinema.dto.response.BookingResponse;
import com.galaxycinema.entity.User;
import com.galaxycinema.repository.UserRepository;
import com.galaxycinema.service.BookingService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "API quản lý đặt vé")
public class BookingController {
    private final BookingService bookingService;
    private final Mappers mappers;
    private final UserRepository userRepository;

    @GetMapping("/user")
    @Operation(summary = "Lấy đặt vé của user", description = "Trả về danh sách tất cả đặt vé của một user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponse>> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(mappers.toBookingResponseList(bookingService.getUserBookings(user.getId())));
    }
    @GetMapping("/all")
    @Operation(summary = "Lấy tất cả đặt vé", description = "Trả về danh sách tất cả đặt vé")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(mappers.toBookingResponseList(bookingService.getAllBookings()));
    }
    @GetMapping("/{id}")
    @Operation(summary = "Lấy đặt vé theo id", description = "Trả về thông tin chi tiết của một đặt vé theo id")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(mappers.toBookingResponse(bookingService.getBookingById(id)));
    }

    @GetMapping("/code/{bookingCode}")
    // @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy đặt vé theo mã", description = "Trả về thông tin chi tiết của một đặt vé theo mã đặt vé")
    public ResponseEntity<BookingResponse> getBookingByCode(@PathVariable String bookingCode) {
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // String userEmail = authentication.getName();
        // User user = userRepository.findByEmail(userEmail)
        //         .orElseThrow(() -> new RuntimeException("User not found"));
       
        return ResponseEntity.ok(mappers.toBookingResponse(bookingService.getBookingByCode(bookingCode)));
    }

    @PostMapping
    @Operation(summary = "Tạo đặt vé mới", description = "Tạo một đặt vé mới với các ghế đã chọn")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        // Lấy userId từ JWT token qua SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(mappers.toBookingResponse(
                bookingService.createBooking(
                        user.getId(),
                        request.showtimeId(),
                        request.seatCodes()
                )));
    }

    @PostMapping("/{bookingCode}/confirm")
    @Operation(summary = "Xác nhận đặt vé", description = "Xác nhận và thanh toán cho một đặt vé")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable String bookingCode, @RequestParam String paymentMethod) {
        return ResponseEntity.ok(mappers.toBookingResponse(bookingService.confirmBooking(bookingCode, paymentMethod)));
    }

    @PostMapping("/{bookingCode}/cancel")
    @Operation(summary = "Hủy đặt vé", description = "Hủy một đặt vé và giải phóng các ghế đã đặt")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingCode) {
        bookingService.cancelBooking(bookingCode);
        return ResponseEntity.noContent().build();
    }
}
