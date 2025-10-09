package com.lmsservice.service.impl;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.common.paging.PageableUtils;
import com.lmsservice.dto.request.course.TeacherCourseFilterRequest;
import com.lmsservice.dto.response.course.TeacherCourse;
import com.lmsservice.entity.*;
import com.lmsservice.mapper.TeacherCourseMapper;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.TeacherService;
import com.lmsservice.spec.CourseSpecifications;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherServiceImpl implements TeacherService {
    CourseRepository courseRepository;
    SessionRepository sessionRepository;
    CurrentUserService currentUserService;
    private final TeacherCourseMapper teacherCourseMapper;

    @Override
    public PageResponse<TeacherCourse> getTeacherCourses(TeacherCourseFilterRequest filter, Pageable pageable) {
        Long teacherId = currentUserService.requireTeacherId();

        var spec = CourseSpecifications.forTeacher(teacherId, filter);

        Set<String> whitelist =
                PageableUtils.toWhitelist("id", "title", "code", "status", "startDate", "plannedSession");
        Sort fallback = Sort.by(Sort.Order.desc("id"));
        Pageable safe = PageableUtils.sanitizeSort(pageable, whitelist, fallback);

        Page<Course> page = courseRepository.findAll(spec, safe);

        Page<TeacherCourse> dtoPage = page.map(teacherCourseMapper::toDto);

        return PageResponse.from(dtoPage);
    }

    @Override
    public PageResponse<TeacherCourse> getCoursesByTeacherId(
            Long teacherId, TeacherCourseFilterRequest filter, Pageable pageable) {
        return null;
    }
}
