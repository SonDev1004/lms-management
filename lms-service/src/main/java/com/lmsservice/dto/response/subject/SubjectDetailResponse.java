package com.lmsservice.dto.response.subject;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectDetailResponse {
    Long id;
    String codeSubject;
    String subjectTitle;
    String subjectDescription;
    Integer sessionNumber;
    BigDecimal fee;
    String imgUrl;
    Integer maxStudents;
    Integer minStudents;
    Boolean isActive;

    List<CourseItem> classes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseItem {
        Long courseId;
        String courseTitle;
        String courseCode;
        Integer plannedSessions;
        Integer capacity;
        LocalDate startDate;
        String schedule;
        Integer status;
        String statusName;
    }
}
