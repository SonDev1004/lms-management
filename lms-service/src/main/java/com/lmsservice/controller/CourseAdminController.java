package com.lmsservice.controller;

import com.lmsservice.dto.request.AddStudentToCourseRequest;
import com.lmsservice.dto.request.AssignTeacherRequest;
import com.lmsservice.dto.request.CreateCoursesByProgramRequest;
import com.lmsservice.dto.request.GenerateSessionsRequest;
import com.lmsservice.dto.request.course.CourseTimeslotRequest;
import com.lmsservice.dto.response.*;
import com.lmsservice.service.CourseService;
import com.lmsservice.service.CourseStudentService;
import com.lmsservice.service.CourseTimeslotService;
import com.lmsservice.service.SessionService;
import com.lmsservice.util.EnrollmentSource;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class CourseAdminController {

    CourseService courseService;
    CourseTimeslotService courseTimeslotService;
    SessionService sessionService;
    CourseStudentService courseStudentService;

    @GetMapping("/list-courses")
    public ApiResponse<List<CourseListItemDTO>> getAllCourses() {
        return ApiResponse.<List<CourseListItemDTO>>builder()
                .message("SUCCESS")
                .result(courseService.getAllCourses())
                .build();
    }

    /**
     * Tạo lớp theo Program -> tạo N course theo curriculum (trackCode chung)
     */
    @PostMapping("/create-courses-by-program")
    public ApiResponse<CreateCoursesByProgramResponse> createCoursesByProgram(
            @RequestBody CreateCoursesByProgramRequest request
    ) {
        CreateCoursesByProgramResponse created = courseService.createCoursesByProgram(request);

        return ApiResponse.<CreateCoursesByProgramResponse>builder()
                .message("SUCCESS")
                .result(created)
                .build();
    }

    /**
     * Gán teacher cho 1 course (teacher gán sau)
     */
    @PutMapping("/{courseId}/teacher")
    public ApiResponse<Void> assignTeacher(
            @PathVariable Long courseId,
            @RequestBody AssignTeacherRequest request
    ) {
        courseService.assignTeacher(courseId, request.getTeacherId());
        return ApiResponse.<Void>builder().message("SUCCESS").build();
    }

    @GetMapping("/{courseId}/list-timeslots")
    public ApiResponse<List<CourseTimeslotResponse>> getTimeslots(@PathVariable Long courseId) {
        return ApiResponse.<List<CourseTimeslotResponse>>builder()
                .code(1000)
                .message("SUCCESS")
                .result(courseTimeslotService.getTimeslots(courseId))
                .build();
    }

    @GetMapping("/{courseId}/sessions")
    public ApiResponse<List<SessionInfoDTO>> getSessions(@PathVariable Long courseId) {
        return ApiResponse.<List<SessionInfoDTO>>builder()
                .code(1000)
                .message("SUCCESS")
                .result(courseService.getSessions(courseId))
                .build();
    }

    @PutMapping("/{courseId}/timeslots")
    public ApiResponse<Void> replaceTimeslots(
            @PathVariable Long courseId,
            @RequestBody List<CourseTimeslotRequest> requests
    ) {
        courseTimeslotService.replaceTimeslots(courseId, requests);
        return ApiResponse.<Void>builder().message("SUCCESS").build();
    }

    @PostMapping("/{courseId}/sessions/generate")
    public ApiResponse<Void> generateSessions(
            @PathVariable Long courseId,
            @RequestBody GenerateSessionsRequest request
    ) {
        sessionService.generateSessionsForCourse(courseId, request);
        return ApiResponse.<Void>builder().message("SUCCESS").build();
    }

    @PostMapping("/{courseId}/publish")
    public ApiResponse<Void> publishCourse(@PathVariable Long courseId) {
        courseService.publishCourse(courseId);
        return ApiResponse.<Void>builder().message("SUCCESS").build();
    }

    @PostMapping("/{courseId}/students")
    public ApiResponse<Void> addStudentToCourse(
            @PathVariable Long courseId,
            @RequestBody AddStudentToCourseRequest request
    ) {
        EnrollmentSource source = request.getSource() != null
                ? EnrollmentSource.valueOf(request.getSource())
                : EnrollmentSource.MANUAL;

        courseStudentService.addStudentToCourse(courseId, request.getStudentId(), source);

        return ApiResponse.<Void>builder().message("SUCCESS").build();
    }

    @GetMapping("/rooms-options")
    public ApiResponse<List<OptionDto>> roomOptions() {
        return ApiResponse.<List<OptionDto>>builder()
                .message("SUCCESS")
                .result(courseService.getRoomOptionsForCourse())
                .build();
    }

}
