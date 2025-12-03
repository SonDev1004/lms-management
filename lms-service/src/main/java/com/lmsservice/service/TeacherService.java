package com.lmsservice.service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.TeacherCourseFilterRequest;
import com.lmsservice.dto.response.course.TeacherCourse;
import org.springframework.data.domain.Pageable;

public interface TeacherService {
    PageResponse<TeacherCourse> getTeacherCourses(TeacherCourseFilterRequest filter, Pageable pageable);

}
