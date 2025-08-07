package com.lmsservice.security;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.lmsservice.entity.Permission;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
/**
 * Cung cấp các phương thức để tạo và xác thực JWT (JSON Web Token).
 * Nó sẽ được sử dụng trong quá trình xác thực người dùng và phân quyền
 * trong ứng dụng Spring Security.
 */
public class JwtTokenProvider {

    @Value("${jwt.accessKey}")
    private String accessSecret;

    @Value("${jwt.refreshKey}")
    private String refreshSecret;

    @Value("${jwt.expiryMinutes}")
    private long accessExpiration;

    @Value("${jwt.expiryDay}")
    private long refreshExpiration;

    /**
     * Tạo Access Token từ thông tin người dùng
     */
    public String generateAccessToken(User user) {
        return generateToken(user, accessSecret, accessExpiration);
    }

    /**
     * Tạo Refresh Token từ thông tin người dùng
     */
    public String generateRefreshToken(User user) {
        return generateToken(user, refreshSecret, refreshExpiration * 60 * 24);
    }

    /**
     * Phương thức chung để tạo token
     */
    private String generateToken(User user, String secret, long expirationTime) {
        List<String> permissions = user.getRole().getPermissions().stream()
                .map(Permission::getName)
                .toList();
        return Jwts.builder()
                .setSubject(user.getUserName())
                .claim("userId", user.getId())
                .claim("roles", List.of(user.getRole().getName()))
                .claim("permissions", permissions)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime * 1000 * 60))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Kiểm tra tính hợp lệ của token
     */
    public boolean validateToken(String token, boolean isRefreshToken) {
        try {
            String secret = isRefreshToken ? refreshSecret : accessSecret;
            Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // Token hết hạn
            throw new UnAuthorizeException(ErrorCode.TOKEN_EXPIRED);
        } catch (UnsupportedJwtException ex) {
            // Token không được hỗ trợ
            throw new UnAuthorizeException(ErrorCode.UNSUPPORTED_TOKEN);
        } catch (MalformedJwtException ex) {
            // Token sai định dạng
            throw new UnAuthorizeException(ErrorCode.MALFORMED_TOKEN);
        } catch (SignatureException ex) {
            // Sai chữ ký (có thể bị giả mạo)
            throw new UnAuthorizeException(ErrorCode.INVALID_SIGNATURE);
        } catch (IllegalArgumentException ex) {
            // Token null hoặc rỗng
            throw new UnAuthorizeException(ErrorCode.INVALID_TOKEN);
        } catch (Exception ex) {
            // Lỗi không xác định
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }
    }

    /**
     * Trích xuất username (subject) từ token
     */
    public String getUsernameFromToken(String token, boolean isRefreshToken) {
        return getClaimFromToken(token, Claims::getSubject, isRefreshToken);
    }

    /**
     * Trích xuất userId từ token
     */
    public Long getUserIdFromToken(String token, boolean isRefreshToken) {
        Claims claims = getAllClaimsFromToken(token, isRefreshToken);
        if (claims != null) {
            Object id = claims.get("userId");
            return id instanceof Integer ? ((Integer) id).longValue() : (Long) id;
        }
        return null;
    }

    public Key getSigningKey(boolean isRefreshToken) {
        String secret = isRefreshToken ? refreshSecret : accessSecret;
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public List<String> getRolesFromToken(String token, boolean isRefreshToken) {
        Claims claims = getAllClaimsFromToken(token, isRefreshToken);
        return claims.get("roles", List.class);
    }

    public List<String> getPermissionsFromToken(String token, boolean isRefreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(isRefreshToken))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("permissions", List.class);
    }

    /**
     * Trích xuất bất kỳ claim nào từ token
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver, boolean isRefreshToken) {
        Claims claims = getAllClaimsFromToken(token, isRefreshToken);
        return claims != null ? claimsResolver.apply(claims) : null;
    }

    /**
     * Trả về toàn bộ claims từ token
     */
    private Claims getAllClaimsFromToken(String token, boolean isRefreshToken) {
        try {
            String secret = isRefreshToken ? refreshSecret : accessSecret;
            return Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public long getExpiration(String token) {
        return Jwts.parser()
                .setSigningKey(accessSecret.getBytes())
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .getTime();
    }
}
