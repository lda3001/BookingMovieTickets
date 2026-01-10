package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record RoomResponse(
        Long id,
        String name,
        Long cinemaId,
        String cinemaName,
        Integer totalRows,
        Integer seatsPerRow,
        String vipRows,
        Boolean isActive,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

