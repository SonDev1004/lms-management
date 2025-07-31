package com.lmsservice.service;

import org.springframework.security.core.Authentication;

import com.lmsservice.dto.response.ProfileResponse;

public interface UserService {
    ProfileResponse getProfile(Authentication authentication);
}
