package com.lmsservice.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.entity.Session;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.service.CourseService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    SessionRepository sessionRepository;

    @Override
    public List<SessionInfoDTO> getSessions(Long courseId) {
        // lấy danh sách session theo courseId, sắp xếp theo orderSession
        List<Session> sessions = sessionRepository.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions.isEmpty()) {
            return new ArrayList<>();
        }
        return sessions.stream()
                .map(s -> SessionInfoDTO.builder()
                        .id(s.getId())
                        .order(s.getOrderSession())
                        .date(s.getDate() != null ? s.getDate().toString() : null)
                        .starttime(s.getStartTime() != null ? s.getStartTime().toString() : null)
                        .endtime(s.getEndTime() != null ? s.getEndTime().toString() : null)
                        .room(s.getRoom() != null ? s.getRoom().getName() : null)
                        .description(s.getDescription())
                        .isabsent(s.isAbsent())
                        .build())
                .toList();
    }
}
