package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class RegisterRequest {
        @NotBlank
        private String userName;

        @NotBlank
        private String password;

        private String firstName;
        private String lastName;
        private Date dateOfBirth;
        private String address;
        private Boolean gender;
        private String email;
        private String phone;
        private String avatar;

        @NotNull
        private Long roleId;
    }

