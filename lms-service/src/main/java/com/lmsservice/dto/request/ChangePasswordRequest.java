package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {

    @NotBlank(message = "Password cũ không được để trống")
    String oldPassword;

    @NotBlank(message = "Password mới không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "Password phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
    @Size(min = 8, max = 50, message = "Password phải từ 8 đến 50 ký tự")
    String newPassword;

    @NotBlank(message = "Xác nhận password không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "Password phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
    @Size(min = 8, max = 50, message = "Password phải từ 8 đến 50 ký tự")
    String confirmPassword;
}
