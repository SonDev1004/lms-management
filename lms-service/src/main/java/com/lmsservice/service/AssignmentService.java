package com.lmsservice.service;

import java.util.List;


import com.lmsservice.dto.request.AssignmentRequest;
import com.lmsservice.dto.response.AssignmentResponse;

public interface AssignmentService {

    // Dùng chung cho Student / Teacher (đã có sẵn)
    List<AssignmentResponse> getAssignmentsByCourseId(Long courseId);

    // ====== TEACHER SIDE ======
    List<AssignmentResponse> getAssignmentsByCourseForTeacher(Long courseId);

    AssignmentResponse createAssignmentForTeacher(Long courseId, AssignmentRequest request);

    AssignmentResponse updateAssignmentForTeacher(Long assignmentId, AssignmentRequest request);

    void deleteAssignmentForTeacher(Long assignmentId);
}
