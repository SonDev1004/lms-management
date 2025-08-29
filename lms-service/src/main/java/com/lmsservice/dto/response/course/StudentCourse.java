package com.lmsservice.dto.response.course;

import java.time.LocalDate;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentCourse {
    // ===== Thông tin cơ bản của course =====
    Long courseId;
    String courseCode; // mã lớp (VD: "IELTS-101")
    String courseTitle;
    Long subjectId; // tên lớp (VD: "IELTS Speaking Booster")
    String subjectName; // tên môn (VD: "IELTS Speaking")
    String description; // mô tả ngắn (optional, FE có thể show dưới title)

    // ===== Giảng viên =====
    Long teacherId;
    String teacherName; // VD: "Lê Hồng Anh"

    // ===== Phòng học (nếu có phòng chính) =====
    Long roomId;
    String roomName; // VD: "P203"

    String daysText; // "T3-T5"
    List<Integer> days; // [3,5]
    String timeText; // "19:00-21:00"

    // ===== Ngày khai giảng & tiến độ =====
    LocalDate startDate; // "2025-08-01"
    Integer plannedSession; // tổng số buổi (VD: 12)
    Integer sessionsDone; // số buổi đã học (VD: 3)

    // ===== Trạng thái học tập =====
    Integer status; // 0=PENDING, 1=ONGOING, 2=FINISHED
    String statusText; // "Sắp khai giảng" / "Đang học" / "Đã học"
}
