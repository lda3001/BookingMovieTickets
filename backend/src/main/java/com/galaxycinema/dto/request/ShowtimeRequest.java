package com.galaxycinema.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ShowtimeRequest(
        @NotNull(message = "ID phim không được để trống")
        Long movieId,

        @NotNull(message = "ID rạp không được để trống")
        Long cinemaId,

        @NotNull(message = "ID phòng không được để trống")
        Long roomId,

        @NotNull(message = "Thời gian chiếu không được để trống")
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime showTime,

        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime endTime,

        String format,

        Double price,

        Boolean isActive
) {
}

