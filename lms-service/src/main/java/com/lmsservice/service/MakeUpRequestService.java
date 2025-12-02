package com.lmsservice.service;

import com.lmsservice.dto.request.CreateMakeUpRequestRequest;
import com.lmsservice.dto.request.MarkMakeUpAttendedRequest;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MakeUpRequestService {

    MakeUpRequestResponse createForCurrentStudent(CreateMakeUpRequestRequest request);

    Page<MakeUpRequestResponse> getForAdmin(String status, Long courseId, Pageable pageable);

    MakeUpRequestResponse markAttended(Long requestId, MarkMakeUpAttendedRequest request);
}
