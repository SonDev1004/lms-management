package com.lmsservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AuthRequest;
import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.dto.response.RefreshRequest;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.security.JwtTokenProvider;
import com.lmsservice.security.TokenService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final TokenService tokenService;

    @Operation(
            summary = "Đăng nhập hệ thống",
            description =
                    "API này cho phép người dùng đăng nhập vào hệ thống bằng tên đăng nhập và mật khẩu. Nếu thông tin hợp lệ, trả về access token, refresh token và thông tin người dùng.")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthRequest req) {

        Authentication auth;
        try {
            auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        } catch (AuthenticationException e) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        return ApiResponse.<AuthResponse>builder()
                .result(AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .userName(user.getUserName())
                        .Permissions(userDetails.getPermissions())
                        .build())
                .message("Login successful")
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        return ResponseEntity.ok(tokenService.refreshAccessToken(request.getRefreshToken()));
    }
}
