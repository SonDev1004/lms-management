package com.lmsservice.dto.response.course;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherCourse extends StudentCourse {
    Integer studentNumber;
    List<StudentList> studentList;
    Long staffId;
    String staffName;

    @Data
    @Builder
    public static class StudentList {
        Long studentId;
        String studentCode;
        String studentName;
        String studentPhone;
        String studentEmail;
        Integer status;
        String statusName;

        Integer presentCount;
        Integer plannedSessions;
    }
}
