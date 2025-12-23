package com.lmsservice.service;

import com.lmsservice.dto.response.StaffCourseBriefResponse;
import com.lmsservice.dto.response.StaffUserProfileResponse;
import com.lmsservice.dto.response.StudentAttendanceDetailDTO;
import com.lmsservice.dto.response.StudentAttendanceOverviewResponse;

import java.util.List;

public interface StaffStudentProfileService {
    StaffUserProfileResponse getStudentProfile(Long userId);
    List<StaffCourseBriefResponse> getStudentCourses(Long userId);

    StudentAttendanceOverviewResponse getAttendanceSummary(Long userId, Long courseId); // user.id
    List<StudentAttendanceDetailDTO> getAttendanceDetails(Long userId, Long courseId); // user.id
}
