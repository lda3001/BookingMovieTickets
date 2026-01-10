package com.galaxycinema.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MovieRequest(
        @Size(max = 255, message = "Slug không được vượt quá 255 ký tự")
        String slug,

        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(max = 500, message = "Tiêu đề không được vượt quá 500 ký tự")
        String title,

        @Size(max = 1000, message = "URL hình ảnh không được vượt quá 1000 ký tự")
        String image,

        @Size(max = 10, message = "Thời lượng không được vượt quá 10 ký tự")
        String duration,

        @Size(max = 10, message = "Đánh giá không được vượt quá 10 ký tự")
        String rating,

        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate releaseDate,

        @Size(max = 100, message = "Quốc gia không được vượt quá 100 ký tự")
        String country,

        @Size(max = 500, message = "Nhà sản xuất không được vượt quá 500 ký tự")
        String producer,

        @Size(max = 200, message = "Thể loại không được vượt quá 200 ký tự")
        String genre,

        @Size(max = 100, message = "Đạo diễn không được vượt quá 100 ký tự")
        String director,

        @Size(max = 500, message = "Diễn viên không được vượt quá 500 ký tự")
        String cast,

        @Size(max = 500, message = "Tagline không được vượt quá 500 ký tự")
        String tagline,

        @Size(max = 200, message = "Phụ đề không được vượt quá 200 ký tự")
        String subtitle,

        @Size(max = 500, message = "URL trailer không được vượt quá 500 ký tự")
        String trailerUrl,

        String content,

        String description,

        Boolean isActive
) {
}

