package com.lmsservice.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.lmsservice.dto.request.*;
import com.lmsservice.entity.PasswordResetToken;
import com.lmsservice.repository.PasswordResetTokenRepository;
import com.lmsservice.service.MailService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final PasswordResetTokenRepository resetTokenRepo;
    private final MailService mailService;
    @Override
    public AuthResponse login(@Valid AuthRequest req) {
        Authentication auth;
        try {
            auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        } catch (AuthenticationException e) {
            throw new UnAuthorizeException(ErrorCode.USER_NOT_EXISTS);
        }

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userDetails.getUser();

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userName(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roleName(user.getRole().getName())
                .permissions(userDetails.getPermissions())
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        return tokenService.refreshAccessToken(request.getRefreshToken());
    }

    @Override
    public void register(@Valid RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new UnAuthorizeException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UnAuthorizeException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = new User();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth()
                    .toInstant()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate());
        } else {
            user.setDateOfBirth(null);
        }
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
        String token = authHeader
                .replaceFirst("^Bearer ", "")
                .replaceFirst("^String,", "")
                .trim();
        Instant expiredAt = tokenProvider.getExpirationDate(token, false);
        blackListService.addToBlackList(token, expiredAt);
    }

    @Override
    public void changePassword(ChangePasswordRequest request, String username) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new UnAuthorizeException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        User user = userRepository
                .findByUserName(username)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.USER_NOT_FOUND));

        // 1. Kiểm tra mật khẩu cũ có đúng không
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new UnAuthorizeException(ErrorCode.OLD_PASSWORD_NOT_MATCH);
        }

        // 2. Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new UnAuthorizeException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        // 3. Cập nhật mật khẩu
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Value("${client.domain}")
    private String feBaseUrl;


    private String sha256(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        String key = request.getEmailOrUsername().trim();

        Optional<User> opt = userRepository.findByEmail(key);
        if (opt.isEmpty()) opt = userRepository.findByUserName(key);

        if (opt.isEmpty()) return;

        User user = opt.get();
        if (user.getEmail() == null || user.getEmail().isBlank()) return;

        // tạo token raw + hash lưu DB
        String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        String hash = sha256(rawToken);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setTokenHash(hash);
        prt.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        prt.setUsed(false);
        resetTokenRepo.save(prt);

        String link = feBaseUrl + "/reset-password?token=" + rawToken;

        // mail content ngắn gọn
        String subject = "[LMS] Reset your password";
        String body =
                "Hello " + (user.getFirstName() != null ? user.getFirstName() : user.getUserName()) + ",\n\n"
                        + "We received a request to reset your password.\n"
                        + "Click the link below to set a new password (valid for 15 minutes):\n"
                        + link + "\n\n"
                        + "If you didn't request this, you can ignore this email.\n";

        mailService.sendMail(user.getEmail(), subject, body);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new UnAuthorizeException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        String hash = sha256(request.getToken().trim());

        PasswordResetToken prt = resetTokenRepo.findByTokenHash(hash)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.UNAUTHENTICATED));

        if (Boolean.TRUE.equals(prt.getUsed())) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }

        User user = prt.getUser();

        // không cho trùng mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new UnAuthorizeException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        prt.setUsedAt(LocalDateTime.now());
        resetTokenRepo.save(prt);
    }
}
