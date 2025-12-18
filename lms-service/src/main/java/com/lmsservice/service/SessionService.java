package com.lmsservice.service;

import com.lmsservice.dto.request.GenerateSessionsRequest;



public interface SessionService {
    void generateSessionsForCourse(Long courseId, GenerateSessionsRequest request);
}
