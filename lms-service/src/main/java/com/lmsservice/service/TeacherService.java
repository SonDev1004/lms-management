package com.lmsservice.service;

import org.springframework.data.domain.Pageable;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.TeacherCourseFilterRequest;
import com.lmsservice.dto.response.course.TeacherCourse;

public interface TeacherService {
    PageResponse<TeacherCourse> getTeacherCourses(TeacherCourseFilterRequest filter, Pageable pageable);

    PageResponse<TeacherCourse> getCoursesByTeacherId(
            Long teacherId, TeacherCourseFilterRequest filter, Pageable pageable);
}
