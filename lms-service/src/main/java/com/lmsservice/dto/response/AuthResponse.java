package com.lmsservice.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthResponse {
    String accessToken;
    String refreshToken;
    String userName;
    String firstName;
    String lastName;
    String roleName;
    List<String> permissions;
}
