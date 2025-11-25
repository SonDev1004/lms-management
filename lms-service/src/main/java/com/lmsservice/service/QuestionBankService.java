package com.lmsservice.service;

import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import com.lmsservice.dto.response.QuestionBankSummaryDto;
import com.lmsservice.entity.QuestionBank;
import com.lmsservice.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QuestionBankService {

    /**
     * Tạo câu MCQ 1 đáp án (type = 1)
     */
    QuestionBank createMcqSingle(CreateMcqQuestionRequest req, Long currentUserId);

    /**
     * Ẩn câu hỏi (is_active = false)
     */
    void deactivate(Long questionId);
    /**
     * Tìm câu hỏi
     */
    Page<QuestionBankSummaryDto> searchQuestions(
            Long subjectId,
            Integer type,
            Boolean active,
            String keyword,
            Pageable pageable
    );

}
