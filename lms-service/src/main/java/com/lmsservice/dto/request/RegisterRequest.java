package com.lmsservice.dto.request;

import java.util.Date;

import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 30, message = "Username phải từ 4 đến 30 ký tự")
    @Pattern(
            regexp = "^(?!.*\\s)[a-zA-Z0-9._-]+$",
            message = "Username chỉ được chứa chữ cái, số, dấu chấm, gạch dưới và gạch ngang")
    private String userName;

    @NotBlank(message = "Password không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "Password phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
    @Size(min = 8, max = 50, message = "Password phải từ 8 đến 50 ký tự")
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

    @NotNull(message = "Giới tính không được để trống")
    private Boolean gender;

    @Email(message = "Email không đúng định dạng")
    @Size(max = 100, message = "Email tối đa 100 ký tự")
    @NotBlank(message = "Email không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại không hợp lệ (10-11 chữ số)")
    private String phone;

    private String avatar;
}
