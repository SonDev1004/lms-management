package com.lmsservice.dto.request.course;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateCourseRequest {
    Long programId;
    Long subjectId;
    Long teacherId;
    Long staffId;
    Integer capacity;
    String title;          // "Summer Camp – Outdoor Communication (Jun 2026)"
    String trackCode;      // mã hiển thị nếu muốn
    LocalDate firstWeekStart; // ngày bắt đầu tuần 1 (vd 2026-06-10)
}
