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

    private Long id;
    private String title;
    private String code;
    private String description;
    private String imageUrl;

    private Integer sessionNumber;
    private BigDecimal fee;

    private Integer minStudent;
    private Integer maxStudent;
    private Boolean isActive;

    private List<CourseItem> courses;

    @Getter @Setter @Builder
    public static class CourseItem {
        private Long courseId;
        private String courseTitle;
        private String courseCode;
        private Integer plannedSessions;
        private Integer capacity;
        private LocalDate startDate;
        private Integer status;
        private String statusName;
        private String schedule;
    }
}

