package com.lmsservice.controller;

import com.lmsservice.dto.request.*;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
                    "API cho phép người dùng đăng nhập bằng username + password. Nếu hợp lệ trả về accessToken, refreshToken và thông tin user.")
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
                    "API cho phép làm mới access token bằng refresh token.")
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        AuthResponse authResponse = authService.refresh(request);
        return ApiResponse.<AuthResponse>builder()
                .result(authResponse)
                .message("Token refreshed successfully")
                .build();
    }

    @Operation(
            summary = "Đăng ký tài khoản",
            description = "API tạo tài khoản mới (role mặc định GUEST theo service).")
    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.<Void>builder()
                .message("Register successful")
                .build();
    }

    @Operation(
            summary = "Đăng xuất",
            description =
                    "API đăng xuất. Token sẽ bị đưa vào blacklist.")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ApiResponse.<Void>builder()
                .message("Logout successful")
                .build();
    }

    @Operation(
            summary = "Đổi mật khẩu (đang đăng nhập)",
            description = "Yêu cầu oldPassword, newPassword, confirmPassword. Cần Authorization.")
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        authService.changePassword(request, username);
        return ApiResponse.<Void>builder()
                .message("Change password successful")
                .build();
    }

    @Operation(
            summary = "Quên mật khẩu",
            description = "Nhập email hoặc username. Hệ thống gửi link reset qua email (không leak tồn tại hay không).")
    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return ApiResponse.<Void>builder()
                .message("If the account exists, a reset email has been sent.")
                .build();
    }

    @Operation(
            summary = "Reset mật khẩu",
            description = "Nhập token + newPassword + confirmPassword. Không cần đăng nhập.")
    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ApiResponse.<Void>builder()
                .message("Password reset successful")
                .build();
    }
}
