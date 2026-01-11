package com.galaxycinema.dto.request;

import lombok.Data;

@Data
public class ImageMetadata {
    public double width;
    public double height;

    public ImageMetadata(double width, double height) {
        this.width = width;
        this.height = height;
    }
}
