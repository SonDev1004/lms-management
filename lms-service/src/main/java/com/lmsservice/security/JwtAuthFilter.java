package com.lmsservice.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.UserRepository;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Bộ lọc xác thực JWT cho các request đến server.
 * Nó sẽ kiểm tra xem request có chứa JWT hợp lệ không và xác thực người dùng nếu có.
 */
@RequiredArgsConstructor
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = getJwtFromRequest(request);

            if (token != null) {
                validateTokenAndSetAuthentication(token, request);
            }
        } catch (ExpiredJwtException ex) {
            log.error("JWT token đã hết hạn: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.TOKEN_EXPIRED);
        } catch (UnsupportedJwtException ex) {
            log.error("JWT token không được hỗ trợ: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.UNSUPPORTED_TOKEN);
        } catch (MalformedJwtException ex) {
            log.error("JWT token sai định dạng: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.MALFORMED_TOKEN);
        } catch (SignatureException ex) {
            log.error("JWT signature không hợp lệ: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.INVALID_SIGNATURE);
        } catch (IllegalArgumentException ex) {
            log.error("JWT token không hợp lệ: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.INVALID_TOKEN);
        } catch (Exception ex) {
            log.error("Lỗi không xác định khi xử lý JWT: {}", ex.getMessage());
            request.setAttribute("errorCode", ErrorCode.UNAUTHENTICATED);
        }

        filterChain.doFilter(request, response);
    }

    private void validateTokenAndSetAuthentication(String token, HttpServletRequest request) {
        if (tokenProvider.validateToken(token, false)) {
            String username = tokenProvider.getUsernameFromToken(token, false);
            List<String> permissions = tokenProvider.getPermissionsFromToken(token, false);
            List<String> roles = tokenProvider.getRolesFromToken(token, false);

            List<GrantedAuthority> authorities = new ArrayList<>();
            if (roles != null) {
                roles.forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));
            }
            if (permissions != null) {
                permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
            }

            User user =
                    userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));

            CustomUserDetails userDetails = new CustomUserDetails(user, authorities, permissions);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
