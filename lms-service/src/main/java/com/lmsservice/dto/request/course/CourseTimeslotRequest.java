package com.lmsservice.dto.request.course;

import java.time.LocalTime;
import lombok.Data;

@Data
public class CourseTimeslotRequest {
    Long id;                 // null = tạo mới, !=null = update
    Integer dayOfWeek;       // 1=Mon,... 7=Sun (tùy bạn)
    LocalTime startTime;
    LocalTime endTime;
    Long roomId;
    Boolean isActive;
    String note;
}