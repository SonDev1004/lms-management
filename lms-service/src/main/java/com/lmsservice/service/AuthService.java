package com.lmsservice.service;

import com.lmsservice.dto.request.*;
import com.lmsservice.dto.response.*;

public interface AuthService {
    AuthResponse login(AuthRequest request);

    AuthResponse refresh(RefreshRequest request);

    void logout(String refreshToken);

    void register(RegisterRequest request);

    void changePassword(ChangePasswordRequest request, String username);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
