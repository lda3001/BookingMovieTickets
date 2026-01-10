package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record CinemaResponse(
        Long id,
        String name,
        String address,
        String phone,
        String city,
        Integer totalRooms,
        Boolean isActive,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

