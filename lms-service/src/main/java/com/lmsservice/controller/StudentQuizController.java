package com.lmsservice.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import com.lmsservice.dto.request.SubmitQuizRequest;
import com.lmsservice.dto.response.*;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.AssignmentDetail;
import com.lmsservice.entity.Submission;
import com.lmsservice.repository.AssignmentDetailRepository;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.SubmissionRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.QuizSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/assignments")
@RequiredArgsConstructor
@Slf4j
public class StudentQuizController {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentDetailRepository assignmentDetailRepository;
    private final SubmissionRepository submissionRepository;
    private final QuizSubmissionService quizSubmissionService;
    private final ObjectMapper objectMapper;
    private final CurrentUserService currentUserService;

    // -------- GET QUIZ --------
    @GetMapping("/{assignmentId}/quiz")
    public ResponseEntity<ApiResponse<QuizViewResponse>> getQuiz(
            @PathVariable Long assignmentId
    ) {
        QuizViewResponse body = quizSubmissionService.getQuizView(assignmentId);

        ApiResponse<QuizViewResponse> resp = ApiResponse.<QuizViewResponse>builder()
                .message("Lấy đề quiz thành công")
                .result(body)
                .build();

        return ResponseEntity.ok(resp);
    }


    // -------- SUBMIT QUIZ --------
    @PostMapping("/{assignmentId}/submissions/{submissionId}/submit-quiz")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitQuiz(
            @PathVariable Long assignmentId,
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> answers
    ) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + submissionId));

        if (!submission.getAssignment().getId().equals(assignmentId)) {
            throw new IllegalArgumentException("Submission does not belong to assignment " + assignmentId);
        }

        SubmitQuizRequest req = new SubmitQuizRequest();
        req.setSubmissionId(submissionId);
        req.setAnswers(answers);

        SubmissionResponse updated = quizSubmissionService.submitAndGrade(req);

        ApiResponse<SubmissionResponse> resp = ApiResponse.<SubmissionResponse>builder()
                .message("Nộp bài quiz thành công")
                .result(updated)
                .build();

        return ResponseEntity.ok(resp);
    }


    // -------- Helper: build câu hỏi từ snapshot --------
    @SuppressWarnings("unchecked")
    private QuizQuestionViewDto buildQuestionViewFromSnapshot(AssignmentDetail detail) {
        QuizQuestionViewDto dto = new QuizQuestionViewDto();
        dto.setQuestionId(detail.getId());
        dto.setOrderNumber(detail.getOrderNumber());
        dto.setPoints(detail.getPoints());

        String snapshotJson = detail.getQuestionSnapshotJson();
        if (snapshotJson == null) {
            return dto;
        }

        try {
            Map<String, Object> snapshot = objectMapper.readValue(
                    snapshotJson,
                    new TypeReference<Map<String, Object>>() {
                    }
            );

            dto.setType((Integer) castNumber(snapshot.get("type"), Integer.class));
            dto.setContent((String) snapshot.get("content"));
            dto.setAudioUrl((String) snapshot.get("audioUrl"));

            Object optionsObj = snapshot.get("options");
            if (optionsObj != null) {
                List<CreateMcqQuestionRequest.OptionDto> options =
                        objectMapper.convertValue(
                                optionsObj,
                                new TypeReference<List<CreateMcqQuestionRequest.OptionDto>>() {
                                }
                        );
                dto.setOptions(options);
            }
        } catch (Exception e) {
            log.error("Error parsing question snapshot for assignmentDetail {}", detail.getId(), e);
        }

        return dto;
    }

    private Object castNumber(Object value, Class<?> targetType) {
        if (!(value instanceof Number)) return null;
        Number n = (Number) value;
        if (targetType == Integer.class) return n.intValue();
        if (targetType == Long.class) return n.longValue();
        if (targetType == Short.class) return n.shortValue();
        return n;
    }

    @PostMapping("/{assignmentId}/start")
    public ResponseEntity<ApiResponse<QuizStartResponse>> startQuiz(
            @PathVariable Long assignmentId
    ) {
        Long studentId = currentUserService.requireStudentId();

        QuizStartResponse data = quizSubmissionService.startQuiz(assignmentId, studentId);

        ApiResponse<QuizStartResponse> resp = ApiResponse.<QuizStartResponse>builder()
                .message("Bắt đầu làm quiz thành công")
                .result(data)
                .build();

        return ResponseEntity.ok(resp);
    }
    @GetMapping("/{assignmentId}/submission-summary")
    public ApiResponse<SubmissionResponse> getMyLatestSubmission(
            @PathVariable Long assignmentId
    ) {
        SubmissionResponse data = quizSubmissionService.getMyLatestSubmission(assignmentId);

        ApiResponse<SubmissionResponse> resp = ApiResponse.<SubmissionResponse>builder()
                .message("Lấy lần nộp bài mới nhất thành công")
                .result(data)
                .build();

        return resp;
    }
}
