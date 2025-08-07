package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.AuthRequest;
import com.lmsservice.dto.request.RefreshRequest;
import com.lmsservice.dto.request.RegisterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j(topic = "AUTH-CONTROLLER")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthService authService;

    @Operation(
            summary = "Đăng nhập hệ thống",
            description =
                    "API này cho phép người dùng đăng nhập vào hệ thống bằng tên đăng nhập và mật khẩu. Nếu thông tin hợp lệ, trả về access token, refresh token và thông tin người dùng.")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        AuthResponse authResponse = authService.login(req);
        return ApiResponse.<AuthResponse>builder()
                .result(authResponse)
                .message("Login successful")
                .build();
    }

    @Operation(
            summary = "Làm mới access token",
            description =
                    "API này cho phép người dùng làm mới access token bằng refresh token. Nếu refresh token hợp lệ, trả về access token mới.")
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        AuthResponse authResponse = authService.refresh(request);
        return ApiResponse.<AuthResponse>builder()
                .result(authResponse)
                .message("Token refreshed successfully")
                .build();
    }

    @Operation(
            summary = "Đăng ký tài khoản",
            description = "API này cho phép người dùng tạo tài khoản mới với vai trò được chỉ định.")
    @PostMapping("/register")
    public ApiResponse<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.builder().message("Register successful").build();
    }

    @Operation(
            summary = "Đăng xuất",
            description =
                    "API này cho phép người dùng đăng xuất khỏi hệ thống. Sau khi đăng xuất, access token sẽ không còn hợp lệ.")
    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ApiResponse.builder().message("Logout successful").build();
    }
}
