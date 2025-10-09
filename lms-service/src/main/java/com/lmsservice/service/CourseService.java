package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.response.SessionInfoDTO;

public interface CourseService {
    List<SessionInfoDTO> getSessions(Long courseId);
}
