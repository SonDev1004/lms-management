package com.lmsservice.controller;

import com.lmsservice.dto.request.AuthRequest;
import com.lmsservice.dto.request.RefreshRequest;
import com.lmsservice.dto.request.RegisterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Đăng nhập hệ thống",
            description =
                    "API này cho phép người dùng đăng nhập vào hệ thống bằng tên đăng nhập và mật khẩu. Nếu thông tin hợp lệ, trả về access token, refresh token và thông tin người dùng.")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthRequest req) {
        AuthResponse authResponse = authService.login(req);

        return ApiResponse.<AuthResponse>builder()
                .result(authResponse)
                .message("Login successful")
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @Operation(
            summary = "Đăng ký tài khoản",
            description = "API này cho phép người dùng tạo tài khoản mới với vai trò được chỉ định."
    )
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Register successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok("Logout successful");
    }
}

