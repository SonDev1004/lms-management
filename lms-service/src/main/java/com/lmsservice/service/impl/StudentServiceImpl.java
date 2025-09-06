package com.lmsservice.service.impl;

import java.time.LocalDate;
import java.util.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.common.paging.PageableUtils;
import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.dto.response.course.StudentCourse;
import com.lmsservice.entity.Course;
import com.lmsservice.mapper.StudentCourseMapper;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.StudentService;
import com.lmsservice.spec.CourseSpecifications;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service // Đánh dấu đây là 1 Spring Service (bean quản lý logic nghiệp vụ)
@RequiredArgsConstructor // Lombok: tự sinh constructor cho các field final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

    CourseRepository courseRepository;
    SessionRepository sessionRepository;
    StudentCourseMapper studentCourseMapper;
    CurrentUserService currentUserService;

    @Override
    public PageResponse<StudentCourse> getStudentCourses(StudentCourseFilterRequest filter, Pageable pageable) {
        Long studentId = currentUserService.requireStudentId();
        return getCoursesByStudentId(studentId, filter, pageable);
    }

    @Override
    public PageResponse<StudentCourse> getCoursesByStudentId(
            Long studentId, StudentCourseFilterRequest filter, Pageable pageable) {
        // ===== 1. Build spec từ filter (keyword, subject, teacher, status, room, daysOfWeek) =====
        var spec = CourseSpecifications.forStudent(studentId, filter);

        // ===== 2. Chỉ cho phép sort theo field "root" của Course =====
        Set<String> whitelist =
                PageableUtils.toWhitelist("id", "title", "code", "status", "startDate", "plannedSession");
        Sort fallback = Sort.by(Sort.Order.desc("id")); // mặc định sort theo id DESC
        Pageable safe = PageableUtils.sanitizeSort(pageable, whitelist, fallback);

        // ===== 3. Query DB =====
        Page<Course> page = courseRepository.findAll(spec, safe);

        // ===== 4. Map entity → DTO =====
        Page<StudentCourse> dtoPage = page.map(course -> {
            long sessionsDone = sessionRepository.countByCourseIdAndDateLessThanEqual(course.getId(), LocalDate.now());
            return studentCourseMapper.toDto(course, sessionsDone);
        });

        // ===== 5. Trả về PageResponse cho FE =====
        return PageResponse.from(dtoPage);
    }
}
