package com.lmsservice.service;

import com.lmsservice.dto.request.course.CourseTimeslotRequest;
import com.lmsservice.dto.response.CourseTimeslotResponse;

import java.util.List;

public interface CourseTimeslotService {
    void replaceTimeslots(Long courseId, List<CourseTimeslotRequest> reqs);
    List<CourseTimeslotResponse> getTimeslots(Long courseId);
}
