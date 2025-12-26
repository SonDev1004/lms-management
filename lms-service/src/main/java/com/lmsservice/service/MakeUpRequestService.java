package com.lmsservice.service;

import com.lmsservice.dto.request.*;
import com.lmsservice.dto.response.AvailableMakeUpSessionResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MakeUpRequestService {

    MakeUpRequestResponse createForCurrentStudent(CreateMakeUpRequestRequest request);

    Page<MakeUpRequestResponse> getForAdmin(String status, Long courseId, Pageable pageable);

    // NEW: lấy danh sách session học bù tương đương cho 1 session bị vắng
    List<AvailableMakeUpSessionResponse> getAvailableMakeupSessionsForStudent(Long missedSessionId);

    // NEW: AM duyệt / từ chối
    MakeUpRequestResponse approve(Long requestId, ApproveMakeUpRequestRequest request);
    MakeUpRequestResponse reject(Long requestId, RejectMakeUpRequestRequest request);

    // DONE: xác nhận đã học bù và cập nhật điểm danh
    MakeUpRequestResponse markAttended(Long requestId, MarkMakeUpAttendedRequest request);

    MakeUpRequestResponse selectPreferredSession(Long requestId, Long preferredSessionId);

    Page<MakeUpRequestResponse> getForStudent(String status, Long courseId, Pageable pageable);
    MakeUpRequestResponse getDetailForStudent(Long requestId);

    // NEW: Admin detail + available sessions by request
    MakeUpRequestResponse getDetailForAdmin(Long requestId);
    List<AvailableMakeUpSessionResponse> getAvailableMakeupSessionsForAdmin(Long requestId);
}
