package com.lmsservice.service.impl;

import com.lmsservice.dto.response.AssignmentScoreItemDto;
import com.lmsservice.dto.response.StudentCourseScoreResponse;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.CourseStudent;
import com.lmsservice.entity.Submission;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.SubmissionRepository;
import com.lmsservice.service.CourseScoreService;
import com.lmsservice.service.StudentScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentScoreServiceImpl implements StudentScoreService {

    private final CourseStudentRepository courseStudentRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CourseScoreService courseScoreService;

    // mapping status int -> string (simple)
    private String toStatusText(Integer status) {
        if (status == null) return "IN_PROGRESS";
        return switch (status) {
            case 1 -> "PASS";
            case 2 -> "FAIL";
            default -> "IN_PROGRESS";
        };
    }

    // tạm thời pass threshold = 6.5; sau này có thể lấy từ Course/Program
    private static final float DEFAULT_PASS_THRESHOLD = 6.5f;

    @Override
    @Transactional(readOnly = true)
    public List<StudentCourseScoreResponse> getAllCourseScoresForStudent(Long studentId) {
        List<CourseStudent> csList = courseStudentRepository.findByStudent_Id(studentId);
        List<StudentCourseScoreResponse> result = new ArrayList<>();

        for (CourseStudent cs : csList) {
            // fallback: nếu averageScore null -> recalc
            if (cs.getAverageScore() == null) {
                try {
                    courseScoreService.recalcCourseStudentAverage(cs.getCourse().getId(), cs.getStudent().getId());
                } catch (Exception e) {
                    log.warn("Cannot recalc average for courseId={} studentId={}: {}", cs.getCourse().getId(), cs.getStudent().getId(), e.getMessage());
                }
            }

            StudentCourseScoreResponse dto = new StudentCourseScoreResponse();
            dto.setCourseId(cs.getCourse().getId());
            dto.setCourseTitle(cs.getCourse().getTitle());
            dto.setAverageScore(cs.getAverageScore());
            dto.setStatus(cs.getStatus());
            dto.setStatusText(toStatusText(cs.getStatus()));
            dto.setPassThreshold(DEFAULT_PASS_THRESHOLD);
            dto.setAssignments(null); // list detail chỉ load khi gọi API chi tiết

            result.add(dto);
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentCourseScoreResponse getCourseScoreForStudent(Long courseId, Long studentId) {
        CourseStudent cs = courseStudentRepository.findByCourse_IdAndStudent_Id(courseId, studentId).orElseThrow(() -> new IllegalArgumentException("CourseStudent not found for courseId=" + courseId + ", studentId=" + studentId));

        // đảm bảo averageScore đã được tính
        if (cs.getAverageScore() == null) {
            courseScoreService.recalcCourseStudentAverage(courseId, studentId);
        }

        StudentCourseScoreResponse dto = new StudentCourseScoreResponse();
        dto.setCourseId(cs.getCourse().getId());
        dto.setCourseTitle(cs.getCourse().getTitle());
        dto.setAverageScore(cs.getAverageScore());
        dto.setStatus(cs.getStatus());
        dto.setStatusText(toStatusText(cs.getStatus()));
        dto.setPassThreshold(DEFAULT_PASS_THRESHOLD);

        // ---- Danh sách assignment + điểm bài ----
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        List<AssignmentScoreItemDto> items = new ArrayList<>();

        for (Assignment a : assignments) {
            AssignmentScoreItemDto item = new AssignmentScoreItemDto();
            item.setAssignmentId(a.getId());
            item.setTitle(a.getTitle());
            item.setAssignmentType(a.getAssignmentType());
            item.setFactor(a.getFactor());
            // maxScore đang là String -> convert sang BigDecimal
            try {
                item.setMaxScore(a.getMaxScore() != null ? new BigDecimal(a.getMaxScore()) : null);
            } catch (Exception e) {
                item.setMaxScore(null);
            }

            // lấy submission mới nhất của student cho assignment này
            Optional<Submission> latestOpt = submissionRepository.findTopByAssignment_IdAndStudent_IdOrderBySubmittedDateDesc(a.getId(), studentId);

            BigDecimal latestScore = latestOpt.map(Submission::getScore).orElse(null);

            item.setLatestScore(latestScore);

            items.add(item);
        }

        dto.setAssignments(items);
        return dto;
    }
}
