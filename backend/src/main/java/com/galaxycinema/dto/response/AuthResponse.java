package com.galaxycinema.dto.response;

import com.galaxycinema.entity.User;

public record AuthResponse(
        String token,
        String type,
        Long userId,
        String email,
        String fullName,
        User.Role role
) {
    public static AuthResponse of(String token, User user) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }
}

