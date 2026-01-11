package com.galaxycinema.service;

import com.galaxycinema.dto.request.ImageMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class FileService {
    
    // Cache để lưu metadata của ảnh đã tính toán
    private final ConcurrentHashMap<String, ImageMetadata> imageMetadataCache = new ConcurrentHashMap<>();

    /**
     * Tính toán kích thước của ảnh
     * @param imagePath đường dẫn tới file ảnh
     * @return ImageMetadata chứa width và height
     * @throws IOException nếu không thể đọc file
     */
    public ImageMetadata calculateImage(String imagePath) throws IOException {
        log.info("Calculating image metadata for: {}", imagePath);
        
        File imageFile = new File(imagePath);
        if (!imageFile.exists()) {
            log.error("Image file not found: {}", imagePath);
            throw new IOException("Image file not found: " + imagePath);
        }

        BufferedImage image = ImageIO.read(imageFile);
        if (image == null) {
            log.error("Unable to read image: {}", imagePath);
            throw new IOException("Unable to read image file. The file may not be a valid image format.");
        }

        int width = image.getWidth();
        int height = image.getHeight();
        
        ImageMetadata metadata = new ImageMetadata(width, height);
        
        // Lưu vào cache
        imageMetadataCache.put(imagePath, metadata);
        log.info("Image metadata calculated and cached: {}x{}", width, height);
        
        return metadata;
    }

    /**
     * Lấy metadata của ảnh từ cache
     * @param imagePath đường dẫn tới file ảnh
     * @return ImageMetadata nếu có trong cache, null nếu không có
     */
    public ImageMetadata getFromCache(String imagePath) {
        ImageMetadata cached = imageMetadataCache.get(imagePath);
        if (cached != null) {
            log.info("Image metadata found in cache for: {}", imagePath);
        }
        return cached;
    }

    /**
     * Xóa metadata khỏi cache
     * @param imagePath đường dẫn tới file ảnh
     */
    public void removeFromCache(String imagePath) {
        imageMetadataCache.remove(imagePath);
        log.info("Removed image metadata from cache: {}", imagePath);
    }

    /**
     * Xóa toàn bộ cache
     */
    public void clearCache() {
        imageMetadataCache.clear();
        log.info("Cleared all image metadata cache");
    }

    /**
     * Lấy số lượng items trong cache
     * @return số lượng items
     */
    public int getCacheSize() {
        return imageMetadataCache.size();
    }
}
