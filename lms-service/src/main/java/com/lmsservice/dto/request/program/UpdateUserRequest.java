package com.lmsservice.dto.request.program;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    private String userName;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String firstName;
    private String lastName;

    private Boolean isActive;

    private Long roleId;
}
