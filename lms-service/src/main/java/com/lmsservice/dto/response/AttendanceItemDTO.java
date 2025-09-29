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
    Long id; // student.id
    String code; // student.code
    String firstname;
    String lastname;
    Boolean gender;
    String dateofbirth;
    String avatar;
    Integer attendance; // 0: Vắng, 1: Có mặt, 2: Đi trễ
    String note;
}
