package com.galaxycinema.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RoomRequest(
        @NotBlank(message = "Tên phòng không được để trống")
        @Size(max = 255, message = "Tên phòng không được vượt quá 255 ký tự")
        String name,

        @NotNull(message = "ID rạp không được để trống")
        Long cinemaId,

        Integer totalRows,

        Integer seatsPerRow,

        @Size(max = 50, message = "Hàng VIP không được vượt quá 50 ký tự")
        String vipRows,

        
) {
}

