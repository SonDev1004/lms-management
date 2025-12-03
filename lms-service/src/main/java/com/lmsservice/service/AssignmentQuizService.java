package com.lmsservice.service;


import com.lmsservice.dto.response.AssignmentQuestionConfig;
import com.lmsservice.dto.response.AssignmentQuizConfigResponse;

import java.util.List;

public interface AssignmentQuizService {

    /**
     * Ghi cấu hình câu hỏi cho assignment (overwrite toàn bộ)
     */
    void configureAssignmentQuestions(Long assignmentId, List<AssignmentQuestionConfig> items);

    AssignmentQuizConfigResponse getQuizConfig(Long assignmentId);
}
