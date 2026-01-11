package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MovieResponse(
        Long id,
        String slug,
        String title,
        String image,
        String duration,
        String rating,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate releaseDate,
        String country,
        String producer,
        String genre,
        String director,
        String cast,
        String tagline,
        String subtitle,
        String trailerUrl,
        String content,
        String description,
        Boolean isActive,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

