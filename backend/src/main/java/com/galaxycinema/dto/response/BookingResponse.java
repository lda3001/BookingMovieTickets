package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.galaxycinema.entity.Booking;

import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        Long id,
        String bookingCode,
        Long userId,
        String userEmail,
        String userFullName,
        Long showtimeId,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime showTime,
        String movieTitle,
        String cinemaName,
        String roomName,
        List<String> seatCodes,
        Double totalPrice,
        Booking.BookingStatus status,
        String paymentMethod,
        String paymentStatus,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

