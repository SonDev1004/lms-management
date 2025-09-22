package com.lmsservice.dto.request;

import com.lmsservice.dto.response.AttendanceItemDTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MarkAttendanceRequest {
    @NotNull
    Long courseId;
    @NotNull
    String date;
    @NotEmpty// Ngày buổi học
    List<AttendanceItemDTO> students; // Danh sách học viên + trạng thái điểm danh
}
