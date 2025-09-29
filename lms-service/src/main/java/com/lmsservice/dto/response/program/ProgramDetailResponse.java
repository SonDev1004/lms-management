package com.lmsservice.dto.response.program;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ProgramDetailResponse {
    Long id;
    String titleProgram;
    String codeProgram;
    String descriptionProgram;
    BigDecimal fee;
    Integer minStudents;
    Integer maxStudents;
    String imgUrl;
    Boolean isActive;

    List<TrackItem> tracks;
    List<SubjectItem> subjectList;

    @Data
    @Builder
    public static class TrackItem {
        String trackCode; // ví dụ: "T246-1830-2030"
        String trackLabel; // ví dụ: "Ca T2-4-6 (18:30–20:30)"
    }

    @Data
    @Builder
    public static class SubjectItem {
        Long subjectId;
        String subjectTitle;
        Integer order; // curriculum_order
        List<CourseItem> courses; // các lớp của môn trong từng track
    }

    @Data
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
        String trackCode;
    }
}
