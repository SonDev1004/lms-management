package com.lmsservice.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.lmsservice.security.JwtAuthFilter;
import com.lmsservice.security.JwtAuthenticationEntryPoint;
import com.lmsservice.service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthFilter jwtAuthFilter;

    public static final String[] PUBLIC_URLS = {
            "/api/auth/login**",
            "/api/auth/register**",
            "/api/auth/refresh**",
            "/api/auth/logout**",
            "/api/files/**",
            "/api/program/**",
            "/api/v1/payments/**",
            "/api/subject/**",
            "/api/v1/enrollments/result/**",
            "/api/v1/enrollments/status/**"
    };

    /**
     * Cấu hình bảo mật cho ứng dụng.
     *
     * @param http HttpSecurity để cấu hình bảo mật
     * @return SecurityFilterChain đã cấu hình
     * @throws Exception nếu có lỗi trong quá trình cấu hình
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(PUBLIC_URLS)
                        .permitAll()
                        .requestMatchers("/api/v1/enrollments/**")
                        .hasAnyRole("GUEST", "STUDENT")
                        .requestMatchers("/api/auth/change-password")
                        .authenticated()
                        .requestMatchers("/api/user/profile")
                        .authenticated()
                        .requestMatchers("/api/student/**")
                        .hasRole("STUDENT")
                        .requestMatchers("/api/teacher/**")
                        .hasRole("TEACHER")
                        .requestMatchers("/api/staff/academic_manager/**")
                        .hasRole("ACADEMIC_MANAGER")
                        .requestMatchers("/api/staff/admin_it/**")
                        .hasRole("ADMIN_IT")
                        .requestMatchers("/api/lesson/**")
                        .authenticated()
                        .anyRequest()
                        .authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * Cấu hình AuthenticationProvider để sử dụng DaoAuthenticationProvider với CustomUserDetailsService.
     *
     * @return AuthenticationProvider đã cấu hình
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // khởi tạo spring web security: swagger
    @Bean
    public WebSecurityCustomizer ignoreResource() {
        return webSecurity -> webSecurity
                .ignoring()
                .requestMatchers(
                        "/actuator/**",
                        "/v3/**",
                        "/webjars/**",
                        "/swagger-ui*/*swagger-initializer.js",
                        "/swagger-ui*/**",
                        "/favicon.ico");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173", "http://14.225.198.117:5173", "https://lms-frontend-2025.web.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
