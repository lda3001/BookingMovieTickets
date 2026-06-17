package com.galaxycinema.dto.request;

import com.galaxycinema.entity.User;
import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequest(
        @NotNull(message = "Vai trò không được để trống")
        User.Role role
) {
}
