package com.lmsservice.dto.request.course;

import java.time.LocalDate;
import java.util.Set;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import org.springdoc.core.annotations.ParameterObject;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ParameterObject
public class StudentCourseFilterRequest {
    // Tìm kiếm
    String keyword; // tìm theo title/code course, subject title, teacher name

    // Lọc cơ bản
    @Min(0)
    @Max(5)
    Integer status; // 0=PENDING, 1=ONGOING, 2=FINISHED (hoặc các trạng thái bạn dùng)

    Long subjectId;
    Long teacherId;

    // Lọc theo lịch
    @Size(max = 7, message = "daysOfWeek tối đa 7 giá trị")
    Set<Integer> daysOfWeek; // ví dụ [2,4,6] => T2/T4/T6

    Long roomId; // phòng chính (theo timeslot active)

    // Thời gian
    LocalDate startDateFrom;
    LocalDate startDateTo;
}
