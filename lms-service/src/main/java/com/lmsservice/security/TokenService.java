package com.lmsservice.security;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.entity.User;
import com.lmsservice.repository.BlackListTokenRepository;
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
    private final StringRedisTemplate redisTemplate;
    private final BlackListTokenRepository blacklistTokenRepository;
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

        return new AuthResponse(
                newAccessToken,
                refreshToken,
                user.getUserName(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().getName(),
                permissionList);
    }

    public void invalidateToken(String token) {
        long expiration = jwtTokenProvider.getExpiration(token); // trả về epoch milli
        long now = System.currentTimeMillis();
        long ttl = expiration - now;

        if (ttl > 0) {
            redisTemplate.opsForValue().set("blacklist:" + token, "true", ttl, TimeUnit.MILLISECONDS);
        }
    }

    @Scheduled(cron = "0 0 * * * *") // mỗi giờ chạy 1 lần
    //    @Scheduled(fixedRate = 10000) // mỗi 10 giây
    public void cleanBlackListTokens() {
        Instant now = Instant.now();
        int deleted = blacklistTokenRepository.deleteByExpiresAtBefore(now);
        System.out.println("Đã xóa " + deleted + " token hết hạn khỏi blacklist.");
    }
}
