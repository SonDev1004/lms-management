package com.lmsservice.security;

import static java.util.Arrays.stream;

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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.lmsservice.config.SecurityConfig;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.BlackListService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Component
@Slf4j(topic = "JWT-AUTH-FILTER")
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final BlackListService blackListService;

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * Phương thức này sẽ được gọi cho mỗi request đến server.
     * Nó sẽ kiểm tra xem request có chứa JWT token hợp lệ hay không.
     * Nếu có, nó sẽ xác thực người dùng và thiết lập thông tin xác thực vào SecurityContext.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Nếu là URL công khai thì bỏ qua filter
        boolean isPublic = stream(SecurityConfig.PUBLIC_URLS).anyMatch(url -> pathMatcher.match(url, path));

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = getJwtFromRequest(request);
            if (token != null) {
                validateTokenAndSetAuthentication(token, request, response);
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

    /**
     * Xác thực token và thiết lập thông tin người dùng vào SecurityContext.
     *
     * @param token JWT token từ request
     * @param request HttpServletRequest để lấy thông tin người dùng
     */
    private void validateTokenAndSetAuthentication(
            String token, HttpServletRequest request, HttpServletResponse response) throws IOException {

        if (!tokenProvider.validateToken(token, false)) {
            return;
        }

        String username = tokenProvider.getUsernameFromToken(token, false);
        List<String> permissions = tokenProvider.getPermissionsFromToken(token, false);
        List<String> roles = tokenProvider.getRolesFromToken(token, false);

        if (blackListService.isTokenBlacklisted(token)) {
            log.warn("Token nằm trong blacklist (đã logout): {}", token);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\":\"Token đã logout và không hợp lệ\"}");
            return;
        }

        User user = userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (roles != null) {
            roles.forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));
        }
        if (permissions != null) {
            permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
        }

        CustomUserDetails userDetails = new CustomUserDetails(user, authorities, permissions);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    /**
     * Lấy JWT token từ header Authorization của request.
     *
     * @param request HttpServletRequest để lấy header
     * @return JWT token nếu có, ngược lại trả về null
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
