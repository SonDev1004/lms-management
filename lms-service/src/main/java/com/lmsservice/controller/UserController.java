package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ProfileResponse;
import com.lmsservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Operation(
            summary = "Lấy thông tin người dùng",
            description = "API này cho phép người dùng lấy thông tin cá nhân của mình sau khi đã đăng nhập thành công.")
    @GetMapping("/profile")
    public ApiResponse<ProfileResponse> getProfile(Authentication authentication) {
            ProfileResponse profile = userService.getProfile(authentication);
            return ApiResponse.<ProfileResponse>builder()
                    .result(profile)
                    .message("Get profile successful")
                    .build();
        }
}
