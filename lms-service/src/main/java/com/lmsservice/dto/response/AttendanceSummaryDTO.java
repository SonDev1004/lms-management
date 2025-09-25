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
public class AttendanceSummaryDTO {
    List<SessionInfoDTO> sessions;
    List<StudentInfoDTO> students;
}
