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
public class ScheduleItemDTO {
    Long sessionId;
    LocalDate date;
    LocalTime startTime;
    LocalTime endTime;

    Long courseId;
    String courseTitle;

    String subjectTitle;
    String roomName;
    String roomLocation;

    String teacherName;
}
