package com.galaxycinema.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CinemaRequest(
        @NotBlank(message = "Tên rạp không được để trống")
        @Size(max = 255, message = "Tên rạp không được vượt quá 255 ký tự")
        String name,

        @Size(max = 200, message = "Địa chỉ không được vượt quá 200 ký tự")
        String address,

        @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
        String phone,

        @Size(max = 100, message = "Thành phố không được vượt quá 100 ký tự")
        String city,

        Integer totalRooms,

        Boolean isActive
) {
}

