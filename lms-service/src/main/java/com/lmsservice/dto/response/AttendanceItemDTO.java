package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceItemDTO {
    Long id;          // student.id - nếu có
    String code;
    String firstname;
    String lastname;
    Boolean gender;
    String dateofbirth;
    String avatar;

    Integer attendance;
    Integer status;

    String note;
}
