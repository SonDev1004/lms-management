package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffUserProfileResponse {
    Long id;
    String userName;
    String email;
    String firstName;
    String lastName;
    Boolean isActive;
    String roleName; // STUDENT / TEACHER ...
}
