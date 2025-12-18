package com.lmsservice.controller;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.course.StudentCourse;
import com.lmsservice.service.StudentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('STUDENT')")
@RequestMapping("/api/student")
public class StudentController {
    StudentService studentService;

    @GetMapping("/me/courses")
    public ResponseEntity<ApiResponse<PageResponse<StudentCourse>>> getStudentCourses(
            @Valid @ParameterObject StudentCourseFilterRequest filter, @ParameterObject Pageable pageable) {

        var response = studentService.getStudentCourses(filter, pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<StudentCourse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all course successfully")
                .result(response)
                .build());
    }

}

