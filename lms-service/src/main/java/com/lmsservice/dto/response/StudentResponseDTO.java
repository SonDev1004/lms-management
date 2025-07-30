package com.lmsservice.dto.response;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDTO {
    private Long id; // student id
    private String code;
    private String level;
    private String note;

    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String address;
    private Boolean gender;
    private String email;
    private String phone;
    private String avatar;
}
