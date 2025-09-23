package com.lmsservice.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentInfoDTO {
    Long id;
    String code;
    String firstname;
    String lastname;
    String avatar;
    List<AttendanceRecordDTO> attendancelist;
}
