package com.galaxycinema.controller;

import com.galaxycinema.dto.request.BookingRequest;
import com.galaxycinema.dto.response.BookingResponse;
import com.galaxycinema.service.BookingService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "API quản lý đặt vé")
public class BookingController {
    private final BookingService bookingService;
    private final Mappers mappers;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy đặt vé của user", description = "Trả về danh sách tất cả đặt vé của một user")
    public ResponseEntity<List<BookingResponse>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(mappers.toBookingResponseList(bookingService.getUserBookings(userId)));
    }

    @GetMapping("/code/{bookingCode}")
    @Operation(summary = "Lấy đặt vé theo mã", description = "Trả về thông tin chi tiết của một đặt vé theo mã đặt vé")
    public ResponseEntity<BookingResponse> getBookingByCode(@PathVariable String bookingCode) {
        return ResponseEntity.ok(mappers.toBookingResponse(bookingService.getBookingByCode(bookingCode)));
    }

    @PostMapping
    @Operation(summary = "Tạo đặt vé mới", description = "Tạo một đặt vé mới với các ghế đã chọn")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(mappers.toBookingResponse(
                bookingService.createBooking(
                        request.userId(),
                        request.showtimeId(),
                        request.seatCodes()
                )));
    }

    @PostMapping("/{bookingCode}/confirm")
    @Operation(summary = "Xác nhận đặt vé", description = "Xác nhận và thanh toán cho một đặt vé")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable String bookingCode) {
        return ResponseEntity.ok(mappers.toBookingResponse(bookingService.confirmBooking(bookingCode)));
    }

    @PostMapping("/{bookingCode}/cancel")
    @Operation(summary = "Hủy đặt vé", description = "Hủy một đặt vé và giải phóng các ghế đã đặt")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingCode) {
        bookingService.cancelBooking(bookingCode);
        return ResponseEntity.noContent().build();
    }
}
