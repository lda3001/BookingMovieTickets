package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.galaxycinema.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dateOfBirth,
        User.Role role,
        Boolean isActive,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime updatedAt
) {
}

