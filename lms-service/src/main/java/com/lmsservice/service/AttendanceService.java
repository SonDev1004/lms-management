package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.request.MarkAttendanceRequest;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.dto.response.StudentAttendanceOverviewResponse;

public interface AttendanceService {

    /**
     * Lấy danh sách session trong 1 ngày để giáo viên chọn buổi
     */
    List<SessionInfoDTO> getSessionsByDate(Long courseId, String dateStr);

    /**
     * Lấy danh sách điểm danh theo session cụ thể (dùng sessionId)
     */
    List<AttendanceItemDTO> getAttendanceBySession(Long sessionId);

    /**
     * Xem tổng hợp điểm danh toàn course
     */
    AttendanceSummaryDTO getAttendanceSummary(Long courseId);

    /**
     * Lưu kết quả điểm danh cho session
     */
    void markAttendance(MarkAttendanceRequest request);

    StudentAttendanceOverviewResponse getStudentAttendanceOverview();
}
