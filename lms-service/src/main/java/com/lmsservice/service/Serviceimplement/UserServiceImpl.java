package com.lmsservice.service.Serviceimplement;

import com.lmsservice.dto.response.ProfileResponse;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public ProfileResponse getProfile(Authentication authentication) {
        if ( authentication == null || !authentication.isAuthenticated()) {
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

        return ProfileResponse.builder()
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
                .build();
    }
}

