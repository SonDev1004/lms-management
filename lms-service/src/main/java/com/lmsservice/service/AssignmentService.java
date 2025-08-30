package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.response.AssignmentResponse;

public interface AssignmentService {
    List<AssignmentResponse> getAssignmentsByCourseId(Long courseId);
}
