package com.lmsservice.dto.request;

import java.util.Date;

import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lmsservice.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 30, message = "Username phải từ 4 đến 30 ký tự")
    private String userName;

    @NotBlank(message = "Password không được để trống")
    @Pattern(regexp = "Strong@Pass123", message = "Password phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt")
    private String password;

    @Size(max = 50, message = "First name tối đa 50 ký tự")
    private String firstName;

    @Size(max = 50, message = "Last name tối đa 50 ký tự")
    private String lastName;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dateOfBirth;

    @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
    private String address;

    private Boolean gender;

    @Email(message = "Email không đúng định dạng")
    private String email;

    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại không hợp lệ (10-11 chữ số)")
    private String phone;

    private String avatar;

    Role role;
}
