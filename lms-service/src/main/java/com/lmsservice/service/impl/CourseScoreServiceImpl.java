// com.lmsservice.service.impl.CourseScoreServiceImpl.java
package com.lmsservice.service.impl;

import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.CourseStudent;
import com.lmsservice.entity.Submission;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.SubmissionRepository;
import com.lmsservice.service.CourseScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseScoreServiceImpl implements CourseScoreService {

    private final SubmissionRepository submissionRepository;
    private final CourseStudentRepository courseStudentRepository;

    // Có thể đưa ra Constant class chung
    private static final int STATUS_IN_PROGRESS = 0;
    private static final int STATUS_PASS = 1;
    private static final int STATUS_FAIL = 2; // chưa dùng nhưng để sẵn

    @Override
    @Transactional
    public void recalcCourseStudentAverage(Long courseId, Long studentId) {
        // 1) Lấy tất cả submission đã auto chấm (graded_status = 1) cho course + student
        List<Submission> subs = submissionRepository
                .findByAssignment_Course_IdAndStudent_IdAndGradedStatus(
                        courseId, studentId, 1
                );

        double totalWeighted = 0.0;
        double totalFactor = 0.0;

        for (Submission s : subs) {
            Assignment a = s.getAssignment();
            if (a == null) {
                log.warn("Submission {} không có assignment, bỏ qua khỏi tính điểm", s.getId());
                continue;
            }

            // factor (mặc định 1 nếu null)
            int factor = (a.getFactor() != null) ? a.getFactor() : 1;

            // score10 = s.score (đã là thang 10 ở submitInternal)
            double score10 = Optional.ofNullable(s.getScore())
                    .orElse(BigDecimal.ZERO)
                    .doubleValue();

            totalWeighted += score10 * factor;
            totalFactor += factor;
        }

        double courseScore = (totalFactor > 0)
                ? totalWeighted / totalFactor
                : 0.0;

        // 2) Lưu vào course_student.averageScore (Float)
        CourseStudent cs = courseStudentRepository
                .findByCourse_IdAndStudent_Id(courseId, studentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "CourseStudent not found for courseId=" + courseId + ", studentId=" + studentId
                ));

        cs.setAverageScore((float) courseScore);

        // 3) Check ngưỡng pass (tạm thời hard-code 6.5f, sau này lấy từ Course/Program)
        float passThreshold = 6.5f;

        if (courseScore >= passThreshold) {
            cs.setStatus(STATUS_PASS);
        } else {
            cs.setStatus(STATUS_IN_PROGRESS); // hoặc STATUS_FAIL tùy rule
        }

        courseStudentRepository.save(cs);
    }
}
