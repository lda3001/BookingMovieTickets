package com.galaxycinema.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.galaxycinema.entity.User;

public record AuthResponse(
        String token,
        String type,
        Long userId,
        String email,
        String fullName,
        String phone,
        User.Role role,
        @JsonFormat(pattern = "dd/MM/yyyy")
        java.time.LocalDate dateOfBirth
) {
    public static AuthResponse of(String token, User user) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getDateOfBirth()
        );
    }
}

