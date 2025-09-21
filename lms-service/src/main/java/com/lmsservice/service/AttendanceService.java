package com.lmsservice.service;

import java.time.LocalDate;
import java.util.List;

import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;

public interface AttendanceService {
    List<AttendanceItemDTO> getAttendanceByDate(Long courseId, LocalDate date);

    AttendanceSummaryDTO getAttendanceSummary(Long courseId);
}
