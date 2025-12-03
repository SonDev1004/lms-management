package com.lmsservice.service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.dto.response.course.StudentCourse;
import org.springframework.data.domain.Pageable;

public interface StudentService {
    PageResponse<StudentCourse> getCoursesByStudentId(
            Long studentId, StudentCourseFilterRequest filter, Pageable pageable);

    PageResponse<StudentCourse> getStudentCourses(StudentCourseFilterRequest filter, Pageable pageable);

}
