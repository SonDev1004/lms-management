package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.request.MarkAttendanceRequest;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;

public interface AttendanceService {
    List<AttendanceItemDTO> getAttendanceByDate(Long courseId, String dateStr);

    AttendanceSummaryDTO getAttendanceSummary(Long courseId);

    void markAttendance(MarkAttendanceRequest request);
}
