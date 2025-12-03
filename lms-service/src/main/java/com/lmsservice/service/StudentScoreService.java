package com.lmsservice.service;

import com.lmsservice.dto.response.StudentCourseScoreResponse;

import java.util.List;

public interface StudentScoreService {
    /**
     * Lấy điểm toàn bộ các khóa mà student đang/đã học.
     */
    List<StudentCourseScoreResponse> getAllCourseScoresForStudent(Long studentId);

    /**
     * Lấy chi tiết điểm theo từng assignment trong 1 course.
     */
    StudentCourseScoreResponse getCourseScoreForStudent(Long courseId, Long studentId);
}
