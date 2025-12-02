package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Submission;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    // đã dùng trong CourseScoreServiceImpl
    List<Submission> findByAssignment_Course_IdAndStudent_IdAndGradedStatus(
            Long courseId,
            Long studentId,
            Integer gradedStatus
    );

    // dùng để show điểm từng bài: lấy submission mới nhất của học sinh
    Optional<Submission> findTopByAssignment_IdAndStudent_IdOrderBySubmittedDateDesc(
            Long assignmentId,
            Long studentId
    );

    
    Optional<Submission> findTopByAssignment_IdAndStudent_IdOrderByStartedAtDesc(
            Long assignmentId,
            Long studentId
    );
}
