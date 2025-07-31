package com.lmsservice.security;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.entity.User;
import com.lmsservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Dịch vụ để xử lý các token JWT, bao gồm việc làm mới access token từ refresh token.
 * Nó sử dụng JwtTokenProvider để xác thực và sinh các token mới.
 */
public class TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    /**
     * Làm mới access token từ refresh token.
     *
     * @param refreshToken Refresh token hợp lệ để làm mới access token.
     * @return AuthResponse chứa access token mới, refresh token cũ và thông tin người dùng.
     */
    public AuthResponse refreshAccessToken(String refreshToken) {
        boolean isValid = jwtTokenProvider.validateToken(refreshToken, true);
        if (!isValid) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken, true);
        // Tìm user
        User user = userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));
        // Sinh access token mới
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        // Lấy danh sách permission
        List<String> permissionList =
                user.getRole().getPermissions().stream().map(p -> p.getName()).toList();

        return new AuthResponse(newAccessToken, refreshToken, user.getUserName(), permissionList);
    }
}
