package com.lmsservice.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import com.lmsservice.dto.response.AttendanceItemDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarkAttendanceRequest {
    Long sessionId;
    Long courseId;
    String date;

    @NotEmpty // Ngày buổi học
    List<AttendanceItemDTO> students; // Danh sách học viên + trạng thái điểm danh
}
