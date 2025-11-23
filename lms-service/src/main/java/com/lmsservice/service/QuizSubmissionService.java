package com.lmsservice.service;

import com.lmsservice.dto.request.SubmitQuizRequest;
import com.lmsservice.dto.response.QuizStartResponse;
import com.lmsservice.dto.response.QuizViewResponse;
import com.lmsservice.dto.response.SubmissionResponse;
import com.lmsservice.entity.Submission;
import org.springframework.transaction.annotation.Transactional;

public interface QuizSubmissionService {

    @Transactional
    Submission submitAndAutoGrade(SubmitQuizRequest req);

    /**
     * Lấy view quiz cho student (danh sách câu hỏi, không có đáp án đúng)
     */
    QuizViewResponse getQuizView(Long assignmentId);

    /**
     * Bắt đầu làm quiz: tạo 1 submission mới cho student
     */
    QuizStartResponse startQuiz(Long assignmentId, Long studentId);

    /**
     * Student nộp bài quiz:
     * - Lưu answers_json
     * - set finished_at
     * - Auto-grade (hiện tại: MCQ_SINGLE)
     * - Cập nhật auto_score, score, graded_status
     */
    SubmissionResponse submitAndGrade(SubmitQuizRequest req);

    /**
     * Lấy lại kết quả 1 lần nộp bài
     */
    SubmissionResponse getResult(Long submissionId);
}
