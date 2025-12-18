package com.lmsservice.controller;

import java.util.List;

import com.lmsservice.entity.Teacher;
import com.lmsservice.repository.TeacherRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.response.*;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.User;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin-it/search")
@RequiredArgsConstructor
public class AdminItSearchController {

    private final UserRepository userRepo;
    private final CourseRepository courseRepo;
    private final ProgramRepository programRepo;
    private final TeacherRepository teacherRepo;
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<SimpleUserDto>> searchUsers(@RequestParam(required = false) String q) {
        List<User> list = (q == null || q.isBlank()) ? userRepo.findAll() : userRepo.searchUsers(q);

        var result = list.stream()
                .limit(50)
                .map(u -> new SimpleUserDto(
                        u.getId(),
                        u.getUserName() != null ? u.getUserName() : (u.getFirstName() + " " + u.getLastName()),
                        u.getEmail()))
                .toList();

        return ApiResponse.<List<SimpleUserDto>>builder()
                .message("Danh sách người dùng")
                .result(result)
                .build();
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<OptionDto>> searchTeachers(@RequestParam(required = false) String q) {
        List<Teacher> list = (q == null || q.isBlank())
                ? teacherRepo.findAll()
                : teacherRepo.searchByName(q);

        var result = list.stream()
                .limit(50)
                .map(t -> {
                    User u = t.getUser();
                    String name = (u.getFirstName() + " " + u.getLastName()).trim();
                    long courseCount = courseRepo.countByTeacherId(t.getId());
                    String label = name + " (" + courseCount + " lớp)";
                    OptionDto dto = new OptionDto();
                    dto.setValue(t.getId().intValue());
                    dto.setLabel(label);
                    return dto;
                })
                .toList();

        return ApiResponse.<List<OptionDto>>builder()
                .message("Danh sách giáo viên")
                .result(result)
                .build();
    }

    @GetMapping("/courses")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<SimpleCourseDto>> searchCourses(@RequestParam(required = false) String q) {
        List<Course> list = (q == null || q.isBlank()) ? courseRepo.findAll() : courseRepo.searchCourses(q);
        var result = list.stream()
                .limit(50)
                .map(c -> new SimpleCourseDto(c.getId(), c.getCode(), c.getTitle()))
                .toList();
        return ApiResponse.<List<SimpleCourseDto>>builder()
                .message("Danh sách khoá học")
                .result(result)
                .build();
    }

    @GetMapping("/programs")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<SimpleProgramDto>> searchPrograms(@RequestParam(required = false) String q) {
        List<Program> list = (q == null || q.isBlank()) ? programRepo.findAll() : programRepo.searchPrograms(q);
        var result = list.stream()
                .limit(50)
                .map(p -> new SimpleProgramDto(p.getId(), p.getTitle())) // Program có trường title
                .toList();
        return ApiResponse.<List<SimpleProgramDto>>builder()
                .message("Danh sách chương trình")
                .result(result)
                .build();
    }
}
