package com.lmsservice.service;

import com.lmsservice.dto.request.GenerateSessionsRequest;
import com.lmsservice.dto.response.SessionInfoDTO;

import java.util.List;


public interface SessionService {
    void generateSessionsForCourse(Long courseId, GenerateSessionsRequest request);
    List<SessionInfoDTO> previewSessionsForCourse(Long courseId, GenerateSessionsRequest req);

}
