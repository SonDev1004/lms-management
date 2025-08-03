package com.lmsservice.service.Serviceimplement;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import jakarta.validation.Valid;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.AuthRequest;
import com.lmsservice.dto.request.RefreshRequest;
import com.lmsservice.dto.request.RegisterRequest;
import com.lmsservice.dto.response.AuthResponse;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.RoleRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.security.JwtTokenProvider;
import com.lmsservice.security.TokenService;
import com.lmsservice.service.AuthService;
import com.lmsservice.service.BlackListService;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;
    private final RoleRepository roleRepository;
    private final BlackListService blackListService;

    @Override
    public AuthResponse login(AuthRequest req) {
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

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userName(user.getUserName())
                .Permissions(userDetails.getPermissions())
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        return tokenService.refreshAccessToken(request.getRefreshToken());
    }

    @Override
    public void register(@Valid RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth()
                .toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate());
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAvatar(request.getAvatar());
        user.setCreatedDate(LocalDateTime.now());
        user.setIsActive(true);

        user.setRole(roleRepository.findByName("GUEST").orElseThrow(() -> new RuntimeException("Role not found")));

        userRepository.save(user);
    }

    @Override
    public void logout(String authHeader) {
        if (authHeader == null) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }
        String token = authHeader.replaceFirst("^Bearer ", "").replaceFirst("^String,", "").trim();
        blackListService.addToBlackList(token);
    }



}
