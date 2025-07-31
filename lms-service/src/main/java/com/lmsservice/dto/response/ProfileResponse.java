package com.lmsservice.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String address;
    private Boolean gender;
    private String email;
    private String phone;
    private String avatar;
    private String role;
    private List<String> permissions;
}
