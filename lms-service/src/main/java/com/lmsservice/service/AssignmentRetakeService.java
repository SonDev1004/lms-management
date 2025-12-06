package com.lmsservice.service;

import com.lmsservice.dto.request.HandleAssignmentRetakeRequest;
import com.lmsservice.entity.AssignmentRetakeRequest;
import com.lmsservice.util.AssignmentRetakeStatus;

import java.util.List;
import java.util.Optional;

public interface AssignmentRetakeService {

    void requestRetake(Long assignmentId, Long studentId, String reason);

    void handleRetake(Long requestId, Long approverUserId, HandleAssignmentRetakeRequest body);

    Optional<AssignmentRetakeRequest> findActiveRetake(Long assignmentId, Long studentId);

    List<AssignmentRetakeRequest> getRequestsForAssignment(Long assignmentId, AssignmentRetakeStatus status);
}
