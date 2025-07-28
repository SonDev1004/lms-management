package com.lmsservice.security;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private final String accessKey = "1ef1ed938c82d16798fa1ec4300d3571988b1b37b9116a7e70c6def68bff3516";
    private final String refreshKey = "0021f3009a0d7a65b84fd75c056ec4c6a46ca6b9961e7cecfd7ffa38e3fc9dd4 ";
    private final long accessExpiration = 5000; // 5s
    private final long refreshExpiration = 1200000; // 20s

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                //                .claim("userId",userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(Keys.hmacShaKeyFor(accessKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(Keys.hmacShaKeyFor(refreshKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(accessKey.getBytes()))
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // Todo : Validate refresh token

    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(accessKey.getBytes()))
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}
