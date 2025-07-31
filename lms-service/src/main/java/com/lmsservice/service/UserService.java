package com.lmsservice.service;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.lmsservice.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


public interface UserService {
     ProfileResponse getProfile( Authentication authentication);
}
