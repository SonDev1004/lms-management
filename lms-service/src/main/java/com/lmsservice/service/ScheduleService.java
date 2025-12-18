package com.lmsservice.service;


import com.lmsservice.dto.response.ScheduleItemDTO;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    List<ScheduleItemDTO> getTeacherSchedule(LocalDate from, LocalDate to);

    List<ScheduleItemDTO> getStudentSchedule(LocalDate from, LocalDate to);

    List<ScheduleItemDTO> getAcademySchedule(LocalDate from, LocalDate to);
}

