package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record ShowtimeResponse(
        Long id,
        Long movieId,
        String movieTitle,
        String movieSlug,
        Long cinemaId,
        String cinemaName,
        Long roomId,
        String roomName,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime showTime,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
        LocalDateTime endTime,
        String format,
        Double price,
        Boolean isActive,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

