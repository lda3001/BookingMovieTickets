package com.galaxycinema.service;

import com.galaxycinema.dto.request.LoginRequest;
import com.galaxycinema.dto.request.RegisterRequest;
import com.galaxycinema.dto.response.AuthResponse;
import com.galaxycinema.entity.User;
import com.galaxycinema.repository.UserRepository;
import com.galaxycinema.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // Tạo user mới
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .dateOfBirth(request.dateOfBirth())
                .role(User.Role.USER)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Tạo JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return AuthResponse.of(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // Xác thực thông tin đăng nhập
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );

            // Lấy thông tin user
            User user = userRepository.findByEmail(request.email())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Kiểm tra tài khoản có active không
            if (!user.getIsActive()) {
                throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
            }

            // Tạo JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

            return AuthResponse.of(token, user);
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }
    }
}

