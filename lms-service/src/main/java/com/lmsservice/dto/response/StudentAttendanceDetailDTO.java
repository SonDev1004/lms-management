package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentAttendanceDetailDTO {
    Long sessionId;
    Long courseId;
    String courseTitle;

    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;

    Integer attendance;
    String statusText;
    String note;
}
