package com.galaxycinema.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Galaxy Cinema Booking API")
                        .version("1.0.0")
                        .description("API documentation for Galaxy Cinema booking system\n\n" +
                                "**Authentication:**\n" +
                                "1. Đăng ký tài khoản qua endpoint `/auth/register`\n" +
                                "2. Đăng nhập qua endpoint `/auth/login` để lấy JWT token\n" +
                                "3. Click vào nút **Authorize** ở trên cùng\n" +
                                "4. Nhập JWT token vào ô \"Value\" (không cần thêm 'Bearer ' ở đầu)\n" +
                                "5. Click **Authorize** để xác thực\n\n" +
                                "**Roles:**\n" +
                                "- `USER`: Có thể xem phim, rạp, lịch chiếu và đặt vé\n" +
                                "- `ADMIN`: Có thể quản lý toàn bộ hệ thống (CRUD movies, cinemas, rooms, showtimes)")
                        .contact(new Contact()
                                .name("Galaxy Cinema")
                                .email("support@galaxycinema.vn")
                                .url("https://www.galaxycine.vn"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.galaxycinema.vn")
                                .description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập JWT token để xác thực. Token được lấy từ endpoint /auth/login")
                        )
                );
    }
}

