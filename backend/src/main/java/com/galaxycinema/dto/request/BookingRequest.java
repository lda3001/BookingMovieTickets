package com.galaxycinema.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BookingRequest(
        @NotNull(message = "ID người dùng không được để trống")
        Long userId,

        @NotNull(message = "ID lịch chiếu không được để trống")
        Long showtimeId,

        @NotEmpty(message = "Danh sách ghế không được để trống")
        List<String> seatCodes
) {
}

