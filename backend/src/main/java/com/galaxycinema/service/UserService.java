package com.galaxycinema.service;

import com.galaxycinema.dto.request.UserRequest;
import com.galaxycinema.dto.response.UserResponse;
import com.galaxycinema.entity.User;
import com.galaxycinema.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tìm kiếm và phân trang người dùng
     */
    public Map<String, Object> searchUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            userPage = userRepository.searchUsers(keyword.trim(), pageable);
        } else {
            userPage = userRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<UserResponse> data = userPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("page", userPage.getNumber());
        response.put("size", userPage.getSize());
        response.put("totalPage", userPage.getTotalPages());
        response.put("totalElements", userPage.getTotalElements());

        return response;
    }

    /**
     * Lấy thông tin chi tiết người dùng
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        return mapToResponse(user);
    }

    /**
     * Tạo người dùng mới
     */
    @Transactional
    public UserResponse createUser(UserRequest request) {
        // Kiểm tra email đã tồn tại
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
                .role(request.role() != null ? request.role() : User.Role.USER)
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        // Kiểm tra email mới có bị trùng không (trừ email hiện tại)
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // Cập nhật thông tin
        user.setEmail(request.email());
        if (request.password() != null && !request.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setDateOfBirth(request.dateOfBirth());
        if (request.role() != null) {
            user.setRole(request.role());
        }
        if (request.isActive() != null) {
            user.setIsActive(request.isActive());
        }

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Cập nhật vai trò người dùng
     */
    @Transactional
    public UserResponse updateUserRole(Long id, User.Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        user.setRole(role);
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    /**
     * Xóa người dùng
     */
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        // Có thể thêm logic kiểm tra trước khi xóa (ví dụ: không cho xóa nếu có bookings)
        if (user.getBookings() != null && !user.getBookings().isEmpty()) {
            throw new RuntimeException("Không thể xóa người dùng đã có đơn đặt vé. Vui lòng vô hiệu hóa thay vì xóa.");
        }

        userRepository.delete(user);
    }

    /**
     * Lấy tất cả người dùng
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Map User entity sang UserResponse
     */
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getDateOfBirth(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
