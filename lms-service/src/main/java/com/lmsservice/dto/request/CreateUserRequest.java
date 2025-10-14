package com.lmsservice.dto.request;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String userName;
    private String email;
    private String firstName;
    private String lastName;
    private Long roleId;
}
