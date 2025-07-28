package com.lmsservice.security;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse refreshAccessToken(String refreshToken) {
        String validationResult = jwtTokenProvider.validateToken(refreshToken);
        if (validationResult != null && !validationResult.isEmpty()) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            String newAccessToken = jwtTokenProvider.generateAccessToken(username);
            return new AuthResponse(newAccessToken, refreshToken);
        } else {
            throw new RuntimeException("Invalid refresh token");
        }
    }
}
