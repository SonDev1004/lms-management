package com.lmsservice.service;

import com.lmsservice.dto.request.CreateCoursesByProgramRequest;
import com.lmsservice.dto.request.course.CreateCourseRequest;
import com.lmsservice.dto.response.CourseListItemDTO;
import com.lmsservice.dto.response.CreateCoursesByProgramResponse;
import com.lmsservice.dto.response.OptionDto;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.entity.Course;

import java.util.List;

public interface CourseService {
    List<SessionInfoDTO> getSessions(Long courseId);

    CreateCoursesByProgramResponse createCoursesByProgram(CreateCoursesByProgramRequest req);

    void assignTeacher(Long courseId, Long teacherId);

    void refreshCourseStatusesMvp();

    void publishCourse(Long courseId);

    List<CourseListItemDTO> getAllCourses();

    List<OptionDto> getRoomOptionsForCourse();
}
