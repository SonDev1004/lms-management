package com.lmsservice.service;

import com.lmsservice.dto.request.AuthRequest;
import com.lmsservice.dto.request.RefreshRequest;
import com.lmsservice.dto.request.RegisterRequest;
import com.lmsservice.dto.response.*;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse refresh(RefreshRequest request);
    void logout(String refreshToken);
    void register(RegisterRequest request);
}
