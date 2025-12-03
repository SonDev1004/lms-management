package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StudentCourseScoreResponse;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.StudentScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/courses")
@RequiredArgsConstructor
@Slf4j
public class StudentScoreController {

    private final StudentScoreService studentScoreService;
    private final CurrentUserService currentUserService;

    /**
     * Dùng cho trang StudentScore: liệt kê tất cả course + điểm trung bình.
     * GET /api/student/courses/my-scores
     */
    @GetMapping("/my-scores")
    public ResponseEntity<ApiResponse<List<StudentCourseScoreResponse>>> getMyCourseScores() {
        Long studentId = currentUserService.requireStudentId();
        List<StudentCourseScoreResponse> data = studentScoreService.getAllCourseScoresForStudent(studentId);

        ApiResponse<List<StudentCourseScoreResponse>> resp = ApiResponse.<List<StudentCourseScoreResponse>>builder().message("Lấy điểm các khóa học thành công").result(data).build();

        return ResponseEntity.ok(resp);
    }

    /**
     * Chi tiết điểm 1 course: điểm trung bình + từng assignment.
     * GET /api/student/courses/{courseId}/score
     */
    @GetMapping("/{courseId}/score")
    public ResponseEntity<ApiResponse<StudentCourseScoreResponse>> getCourseScore(@PathVariable Long courseId) {
        Long studentId = currentUserService.requireStudentId();
        StudentCourseScoreResponse data = studentScoreService.getCourseScoreForStudent(courseId, studentId);

        ApiResponse<StudentCourseScoreResponse> resp = ApiResponse.<StudentCourseScoreResponse>builder().message("Lấy điểm khóa học thành công").result(data).build();

        return ResponseEntity.ok(resp);
    }
}
