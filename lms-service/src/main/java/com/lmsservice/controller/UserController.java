package com.lmsservice.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ProfileResponse;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.security.CustomUserDetails;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ApiResponse<ProfileResponse> getProfile(Authentication authentication) {
        if (true) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository
                .findById(userDetails.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String mainRole = user.getRole() != null ? user.getRole().getName() : "UNKNOWN";

        // Lấy toàn bộ permissions từ userDetails
        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(p -> !p.startsWith("ROLE_"))
                .toList();

        return ApiResponse.<ProfileResponse>builder()
                .result(ProfileResponse.builder()
                        .id(user.getId())
                        .username(user.getUserName())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .dateOfBirth(user.getDateOfBirth())
                        .address(user.getAddress())
                        .gender(user.getGender())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .avatar(user.getAvatar())
                        .role(mainRole)
                        .permissions(permissions)
                        .build())
                .message("Profile retrieved successfully")
                .build();
    }
}
