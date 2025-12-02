package com.lmsservice.service;

public interface CourseScoreService {

    /**
     * Tính lại điểm trung bình (average_score) cho 1 học viên trong 1 course,
     * dựa trên tất cả submission đã chấm (graded_status = 1).
     */
    void recalcCourseStudentAverage(Long courseId, Long studentId);
}
