package com.lmsservice.service;

import com.lmsservice.dto.response.StaffCourseBriefResponse;
import com.lmsservice.dto.response.StaffUserProfileResponse;

import java.util.List;

public interface StaffTeacherProfileService {
    StaffUserProfileResponse getTeacherProfile(Long teacherId);
    List<StaffCourseBriefResponse> getTeacherCourses(Long teacherId);
}

