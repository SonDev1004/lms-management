package com.lmsservice.service.impl;

import com.lmsservice.dto.response.StaffCourseBriefResponse;
import com.lmsservice.dto.response.StaffUserProfileResponse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.Teacher;
import com.lmsservice.entity.User;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.TeacherRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.StaffTeacherProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffTeacherProfileServiceImpl implements StaffTeacherProfileService {

    UserRepository userRepo;
    TeacherRepository teacherRepo;
    CourseRepository courseRepo;

    @Override
    @Transactional(readOnly = true)
    public StaffUserProfileResponse getTeacherProfile(Long userId) {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        teacherRepo.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

        return StaffUserProfileResponse.builder()
                .id(u.getId())
                .userName(u.getUserName())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .roleName(u.getRole() != null ? u.getRole().getName() : null)
                .isActive(u.getIsActive())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffCourseBriefResponse> getTeacherCourses(Long userId) {
        Teacher teacher = teacherRepo.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

        List<Course> courses = courseRepo.findByTeacher_Id(teacher.getId());
        if (courses == null || courses.isEmpty()) return List.of();

        return courses.stream()
                .filter(Objects::nonNull)
                .map(c -> {
                    String statusStr = c.getStatus() != null ? c.getStatus().toString() : null;
                    String startDateStr = c.getStartDate() != null ? c.getStartDate().toString() : null;

                    return StaffCourseBriefResponse.builder()
                            .courseId(c.getId())
                            .code(c.getCode())
                            .name(c.getTitle())
                            .status(statusStr)
                            .startDate(startDateStr)
                            .build();
                })
                .collect(Collectors.toList());
    }
}