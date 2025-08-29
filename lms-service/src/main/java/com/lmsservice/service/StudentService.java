package com.lmsservice.service;

import org.springframework.data.domain.Pageable;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.dto.response.course.StudentCourse;

public interface StudentService {
    PageResponse<StudentCourse> getCoursesByStudentId(
            Long studentId, StudentCourseFilterRequest filter, Pageable pageable);
}
