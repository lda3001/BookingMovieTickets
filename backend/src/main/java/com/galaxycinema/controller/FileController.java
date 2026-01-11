package com.galaxycinema.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.galaxycinema.dto.request.ImageMetadata;
import com.galaxycinema.service.FileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
@Slf4j
@Tag(name = "Files", description = "API quản lý file và hình ảnh")
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir; // ./uploads

    private Path root;

    private final FileService fileService;
    
    // Các định dạng file được phép upload
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList(
        "jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"
    );
    
    // Kích thước file tối đa (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostConstruct
    public void init() {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
            log.info("Upload directory initialized at: {}", root);
        } catch (IOException e) {
            log.error("Could not initialize storage directory", e);
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload file", description = "Upload một file lên server (chỉ Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadFile(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        try {
            // Validate file không rỗng
            if (file.isEmpty()) {
                log.warn("Attempted to upload empty file");
                return ResponseEntity.badRequest().body("File is empty or missing");
            }

            // Validate kích thước file
            if (file.getSize() > MAX_FILE_SIZE) {
                log.warn("File size exceeds limit: {} bytes", file.getSize());
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("File size exceeds maximum limit of 10MB");
            }

            // Lấy tên file gốc và extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                log.warn("Original filename is null or empty");
                return ResponseEntity.badRequest().body("Invalid filename");
            }

            String extension = "";
            int lastDotIndex = originalFilename.lastIndexOf(".");
            if (lastDotIndex > 0) {
                extension = originalFilename.substring(lastDotIndex + 1).toLowerCase();
            }

            // Validate extension cho file ảnh
            if (!extension.isEmpty() && !ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
                log.warn("Invalid file extension: {}", extension);
                return ResponseEntity.badRequest()
                    .body("Invalid file type. Allowed types: " + String.join(", ", ALLOWED_IMAGE_EXTENSIONS));
            }

            // Lấy filename từ query param hoặc tạo unique filename
            String customFilename = request.getParameter("filename");
            String newFileName;
            
            if (customFilename != null && !customFilename.isEmpty()) {
                // Sử dụng tên file custom (đảm bảo có extension)
                if (!customFilename.contains(".") && !extension.isEmpty()) {
                    newFileName = customFilename + "." + extension;
                } else {
                    newFileName = customFilename;
                }
            } else {
                // Tạo tên file unique với UUID
                String baseName = originalFilename.substring(0, lastDotIndex > 0 ? lastDotIndex : originalFilename.length());
                String uniqueId = UUID.randomUUID().toString().substring(0, 8);
                newFileName = baseName + "_" + uniqueId + (extension.isEmpty() ? "" : "." + extension);
            }

            // Sanitize filename (remove special characters)
            newFileName = newFileName.replaceAll("[^a-zA-Z0-9._-]", "_");

            // Resolve file path và validate
            Path targetLocation = this.root.resolve(newFileName).normalize();
            if (!targetLocation.startsWith(this.root)) {
                log.error("Path traversal attempt detected: {}", newFileName);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file path");
            }

            // Lưu file
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("File uploaded successfully: {}", newFileName);
            
            // Return relative URL path
            return ResponseEntity.ok("/files/" + newFileName);
            
        } catch (IOException e) {
            log.error("Error uploading file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store file. Error: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during file upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{filename}")
    @Operation(summary = "Lấy file", description = "Lấy file theo tên file")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            // Sanitize filename để tránh path traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                log.warn("Invalid filename detected: {}", filename);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            Path filePath = root.resolve(filename).normalize();

            // Kiểm tra đường dẫn hợp lệ và file tồn tại
            if (!filePath.startsWith(root)) {
                log.warn("Path traversal attempt: {}", filename);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            if (!Files.exists(filePath)) {
                log.warn("File not found: {}", filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new FileSystemResource(filePath);
            String contentType = Files.probeContentType(filePath);

            // Determine if file should be inline (for images) or attachment
            String disposition = "inline";
            if (contentType == null || !contentType.startsWith("image/")) {
                // Mã hóa tên file sang UTF-8 cho filename*
                String originalFileName = resource.getFilename();
                String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);
                disposition = "attachment; filename*=UTF-8''" + encodedFileName;
            }

            log.info("Serving file: {}", filename);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000") // Cache for 1 year
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(resource);
                    
        } catch (IOException e) {
            log.error("IO Error while serving file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            log.error("Unexpected error while serving file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/get-metadata-image")
    @Operation(summary = "Lấy metadata của ảnh", description = "Lấy thông tin kích thước (width, height) của ảnh")
    public ResponseEntity<ImageMetadata> getMetadataImage(@RequestParam String path) {
        try {
            // Sanitize path
            if (path.contains("..") || path.contains("/") || path.contains("\\")) {
                log.warn("Invalid path detected: {}", path);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            Path filePath = root.resolve(path).normalize();
            
            // Validate path
            if (!filePath.startsWith(root)) {
                log.warn("Path traversal attempt: {}", path);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            if (!Files.exists(filePath)) {
                log.warn("Image file not found: {}", path);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Try to get from cache first
            ImageMetadata cached = fileService.getFromCache(filePath.toString());
            if (cached != null) {
                log.info("Image metadata retrieved from cache: {}", path);
                return ResponseEntity.ok(cached);
            }

            // Calculate and cache
            log.info("Calculating image metadata: {}", path);
            ImageMetadata metadata = fileService.calculateImage(filePath.toString());
            return ResponseEntity.ok(metadata);
            
        } catch (IOException e) {
            log.error("Error getting image metadata for: {}", path, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            log.error("Unexpected error getting image metadata for: {}", path, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{filename}")
    @Operation(summary = "Xóa file", description = "Xóa file khỏi server (chỉ Admin)")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteFile(@PathVariable String filename) {
        log.info("Attempting to delete file: {}", filename);
        
        try {
            // Sanitize filename
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                log.warn("Invalid filename detected: {}", filename);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid filename");
            }

            Path filePath = root.resolve(filename).normalize();
            
            // Validate path
            if (!filePath.startsWith(root)) {
                log.warn("Path traversal attempt: {}", filename);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file path");
            }

            if (!Files.exists(filePath)) {
                log.warn("File not found for deletion: {}", filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            // Delete file
            Files.delete(filePath);
            
            // Remove from cache if exists
            fileService.removeFromCache(filePath.toString());
            
            log.info("File deleted successfully: {}", filename);
            return ResponseEntity.ok("File deleted successfully");
            
        } catch (IOException e) {
            log.error("Error deleting file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete file. Error: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error deleting file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred: " + e.getMessage());
        }
    }
}
