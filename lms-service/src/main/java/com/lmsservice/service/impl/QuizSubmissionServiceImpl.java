package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import com.lmsservice.dto.request.SubmitQuizRequest;
import com.lmsservice.dto.response.QuizQuestionViewDto;
import com.lmsservice.dto.response.QuizStartResponse;
import com.lmsservice.dto.response.QuizViewResponse;
import com.lmsservice.dto.response.SubmissionResponse;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.AssignmentDetail;
import com.lmsservice.entity.Student;
import com.lmsservice.entity.Submission;
import com.lmsservice.repository.AssignmentDetailRepository;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.repository.SubmissionRepository;
import com.lmsservice.service.QuizSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizSubmissionServiceImpl implements QuizSubmissionService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentDetailRepository assignmentDetailRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final ObjectMapper objectMapper;

    /* ==========================================================
     *               METHOD CŨ (ENTITY) – DÙNG LẠI LOGIC MỚI
     * ========================================================== */

    /**
     * Giữ để tương thích ngược: chỗ nào BE cũ gọi submitAndAutoGrade
     * vẫn chạy đúng. Logic chấm điểm dùng chung với submitAndGrade.
     */
    @Override
    @Transactional
    public Submission submitAndAutoGrade(SubmitQuizRequest req) {
        Submission submission = submitInternal(req);
        // trả về entity cho code cũ nếu còn dùng
        return submission;
    }

    /* ==========================================================
     *               GET QUIZ VIEW
     * ========================================================== */

    @Override
    @Transactional(readOnly = true)
    public QuizViewResponse getQuizView(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        var details = assignmentDetailRepository
                .findByAssignmentIdOrderByOrderNumberAsc(assignmentId);

        List<QuizQuestionViewDto> questions = new ArrayList<>();
        for (AssignmentDetail detail : details) {
            questions.add(toQuizQuestionView(detail));
        }

        QuizViewResponse resp = new QuizViewResponse();
        resp.setAssignmentId(assignment.getId());
        resp.setAssignmentTitle(assignment.getTitle());
        // nếu sau này có durationMinutes thì set thêm
        resp.setQuestions(questions);
        return resp;
    }

    private QuizQuestionViewDto toQuizQuestionView(AssignmentDetail detail) {
        QuizQuestionViewDto dto = new QuizQuestionViewDto();
        // dùng id của AssignmentDetail làm questionId cho FE
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

            Object typeObj = snapshot.get("type");
            if (typeObj instanceof Number n) {
                dto.setType(n.intValue());
            }

            dto.setContent(Objects.toString(snapshot.get("content"), null));
            dto.setAudioUrl(Objects.toString(snapshot.get("audioUrl"), null));

            Object optRaw = snapshot.get("options");
            if (optRaw != null) {
                dto.setOptions(
                        objectMapper.convertValue(
                                optRaw,
                                new TypeReference<List<CreateMcqQuestionRequest.OptionDto>>() {
                                }
                        )
                );
            }
        } catch (Exception e) {
            log.error("Error parsing question snapshot for AssignmentDetail {}", detail.getId(), e);
        }

        return dto;
    }

    /* ==========================================================
     *               START QUIZ
     * ========================================================== */

    @Override
    @Transactional
    public QuizStartResponse startQuiz(Long assignmentId, Long studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setStartedAt(LocalDateTime.now());
        submission.setFinishedAt(null);
        submission.setAnswersJson(null);
        // điểm lúc bắt đầu = 0
        submission.setScore(BigDecimal.ZERO);

        submission = submissionRepository.save(submission);

        QuizStartResponse resp = new QuizStartResponse();
        resp.setAssignmentId(assignmentId);
        resp.setSubmissionId(submission.getId());
        return resp;
    }

    /* ==========================================================
     *               SUBMIT + AUTO GRADE (DTO)
     * ========================================================== */

    @Override
    @Transactional
    public SubmissionResponse submitAndGrade(SubmitQuizRequest req) {
        Submission submission = submitInternal(req);
        return toSubmissionResponse(submission);
    }

    /**
     * Core logic: lưu answers_json + auto grade + update score.
     * Dùng chung cho cả submitAndGrade (DTO) và submitAndAutoGrade (entity).
     */
    @Transactional
    protected Submission submitInternal(SubmitQuizRequest req) {
        if (req.getSubmissionId() == null) {
            throw new IllegalArgumentException("submissionId is required");
        }

        Submission submission = submissionRepository.findById(req.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + req.getSubmissionId()));

        Map<String, Object> answers =
                Optional.ofNullable(req.getAnswers()).orElseGet(HashMap::new);

        // lưu answers_json
        try {
            String answersJson = objectMapper.writeValueAsString(answers);
            submission.setAnswersJson(answersJson);
        } catch (Exception e) {
            throw new RuntimeException("Invalid answers payload", e);
        }

        submission.setFinishedAt(LocalDateTime.now());

        // auto grade theo snapshot
        double totalScore = autoGradeSubmission(submission, answers);

        // lưu điểm dưới dạng BigDecimal
        submission.setScore(BigDecimal.valueOf(totalScore));

        return submissionRepository.save(submission);
    }

    private double autoGradeSubmission(Submission submission, Map<String, Object> answers) {
        Long assignmentId = submission.getAssignment().getId();

        var details = assignmentDetailRepository
                .findByAssignmentIdOrderByOrderNumberAsc(assignmentId);

        double total = 0.0;

        for (AssignmentDetail detail : details) {
            String snapshotJson = detail.getQuestionSnapshotJson();
            if (snapshotJson == null) continue;

            Map<String, Object> snapshot;
            try {
                snapshot = objectMapper.readValue(
                        snapshotJson,
                        new TypeReference<Map<String, Object>>() {
                        }
                );
            } catch (Exception e) {
                log.error("Error parsing question snapshot for AssignmentDetail {}", detail.getId(), e);
                continue;
            }

            // hiện tại: giả định câu hỏi MCQ single, snapshot có "correctKey"
            Object typeObj = snapshot.get("type");
            int type = (typeObj instanceof Number n) ? n.intValue() : 0;

            if (type != 1) {
                // sau này mở rộng thêm loại khác
                continue;
            }

            String correctKey = Objects.toString(snapshot.get("correctKey"), null);
            if (correctKey == null) {
                continue;
            }

            // FE gửi answer map với key = id của AssignmentDetail
            Object studentAnswer = answers.get(String.valueOf(detail.getId()));
            if (studentAnswer == null) {
                continue;
            }

            String studentKey = studentAnswer.toString();
            if (correctKey.equalsIgnoreCase(studentKey)) {
                if (detail.getPoints() != null) {
                    total += detail.getPoints().doubleValue();
                }
            }
        }

        return total;
    }

    /* ==========================================================
     *               GET RESULT
     * ========================================================== */

    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getResult(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + submissionId));
        return toSubmissionResponse(submission);
    }

    private SubmissionResponse toSubmissionResponse(Submission s) {
        SubmissionResponse dto = new SubmissionResponse();
        dto.setSubmissionId(s.getId());
        dto.setAssignmentId(s.getAssignment().getId());
        dto.setScore(s.getScore());

        String maxScoreStr = s.getAssignment().getMaxScore();
        BigDecimal maxScore = null;
        try {
            maxScore = (maxScoreStr != null) ? new BigDecimal(maxScoreStr) : null;
        } catch (Exception e) {
            maxScore = null;
        }
        dto.setMaxScore(maxScore);

        try {
            BigDecimal scoreBd = Optional.ofNullable(s.getScore()).orElse(BigDecimal.ZERO);
            double score = scoreBd.doubleValue();
            double max = Optional.ofNullable(maxScore).orElse(BigDecimal.ZERO).doubleValue();
            if (max > 0) {
                int pct = (int) Math.round(score * 100.0 / max);
                dto.setPercentage(pct);
            }
        } catch (Exception e) {
            dto.setPercentage(null);
        }

        dto.setStatus("GRADED");
        dto.setStartedAt(s.getStartedAt());
        dto.setFinishedAt(s.getFinishedAt());
        return dto;
    }
}