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
import com.lmsservice.service.CourseScoreService;
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
    private final CourseScoreService courseScoreService;   // <-- thêm

    /* ==========================================================
     *               METHOD CŨ (ENTITY) – DÙNG LẠI LOGIC MỚI
     * ========================================================== */

    @Override
    @Transactional
    public Submission submitAndAutoGrade(SubmitQuizRequest req) {
        // dùng chung core logic
        return submitInternal(req);
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
        resp.setQuestions(questions);
        return resp;
    }

    private QuizQuestionViewDto toQuizQuestionView(AssignmentDetail detail) {
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
        Optional<Submission> latest = submissionRepository
                .findTopByAssignment_IdAndStudent_IdOrderBySubmittedDateDesc(assignmentId, studentId);

        if (latest.isPresent() && Objects.equals(latest.get().getGradedStatus(), 1)) {
            throw new IllegalStateException("Quiz already submitted and graded");
        }
        Submission submission = new Submission();

        // Quan hệ bắt buộc
        submission.setAssignment(assignment);
        submission.setStudent(student);

        // Các cột NOT NULL / default
        submission.setFileName("QUIZ-" + assignmentId + "-" + studentId + "-" + System.currentTimeMillis());
        submission.setScore(BigDecimal.ZERO);      // điểm ban đầu
        submission.setAutoScore(BigDecimal.ZERO);  // auto_score
        submission.setGradedStatus(0);             // 0 = chưa chấm

        // Thời gian + answers
        submission.setStartedAt(LocalDateTime.now());
        submission.setFinishedAt(null);
        submission.setSubmittedDate(null);
        submission.setAnswersJson(null);

        try {
            submission = submissionRepository.save(submission);
        } catch (Exception e) {
            log.error("Failed saving Submission assignmentId={} studentId={}: {}",
                    assignmentId, studentId, e.toString(), e);
            throw e;
        }

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

        // 1) Lưu answers_json
        try {
            String answersJson = objectMapper.writeValueAsString(answers);
            submission.setAnswersJson(answersJson);
        } catch (Exception e) {
            throw new RuntimeException("Invalid answers payload", e);
        }

        submission.setFinishedAt(LocalDateTime.now());
        submission.setSubmittedDate(LocalDateTime.now());

        // 2) Auto grade theo snapshot → tổng điểm (raw)
        double totalScore = autoGradeSubmission(submission, answers);

        // 3) Lưu điểm & trạng thái chấm
        submission.setAutoScore(BigDecimal.valueOf(totalScore));
        submission.setScore(BigDecimal.valueOf(totalScore));
        submission.setGradedStatus(1); // 1 = auto_done

        Submission saved = submissionRepository.save(submission);

        try {
            Long courseId = saved.getAssignment().getCourse().getId();
            Long studentId = saved.getStudent().getId();
            courseScoreService.recalcCourseStudentAverage(courseId, studentId);
        } catch (Exception ex) {
            log.warn("Không tính lại được course average cho submission {}: {}",
                    saved.getId(), ex.getMessage(), ex);
        }

        return saved;
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
            Object typeObj = snapshot.get("type");
            int type = (typeObj instanceof Number n) ? n.intValue() : 0;

            if (type != 1) {
                continue;
            }

            String correctKey = Objects.toString(snapshot.get("correctKey"), null);
            if (correctKey == null) {
                continue;
            }
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

        // maxScore
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
            double max = Optional.ofNullable(maxScore).orElse(BigDecimal.TEN).doubleValue(); // default 10

            if (max > 0) {
                int pct = (int) Math.round(score * 100.0 / max);
                dto.setPercentage(pct);
            }
        } catch (Exception e) {
            dto.setPercentage(null);
        }

        // ====== STATUS MAPPING ======
        String status;
        Integer gs = s.getGradedStatus();

        if (gs != null) {
            switch (gs) {
                case 1 -> status = "GRADED";
                case 2 -> status = "REVIEWED";
                default -> status = "SUBMITTED";
            }
        } else {
            if (s.getFinishedAt() != null) {
                status = "SUBMITTED";
            } else if (s.getStartedAt() != null) {
                status = "IN_PROGRESS";
            } else {
                status = "NOT_STARTED";
            }
        }

        dto.setStatus(status);

        dto.setStartedAt(s.getStartedAt());
        dto.setFinishedAt(s.getFinishedAt());
        return dto;
    }
}
