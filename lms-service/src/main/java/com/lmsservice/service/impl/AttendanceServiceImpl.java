package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.MarkAttendanceRequest;
import com.lmsservice.dto.response.*;
import com.lmsservice.entity.*;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.AttendanceService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final SessionRepository sessionRepository;
    private final CourseStudentRepository courseStudentRepository;
    private final ObjectMapper objectMapper;
    private final CurrentUserService currentUserService;

    /**
     * 🔹 Lấy danh sách session trong 1 ngày
     */
    @Override
    public List<SessionInfoDTO> getSessionsByDate(Long courseId, String dateStr) {
        List<Session> sessions = sessionRepository.findByCourseIdAndDate(courseId, java.time.LocalDate.parse(dateStr));
        if (sessions.isEmpty()) {
            throw new AppException(ErrorCode.SESSION_NOT_FOUND);
        }

        return sessions.stream().map(s -> SessionInfoDTO.builder().id(s.getId()).order(s.getOrderSession()).date(s.getDate() != null ? s.getDate().toString() : null).starttime(s.getStartTime() != null ? s.getStartTime().toString() : null).endtime(s.getEndTime() != null ? s.getEndTime().toString() : null).room(s.getRoom() != null ? s.getRoom().getName() : null).description(s.getDescription()).isabsent(s.isAbsent()).build()).toList();
    }

    /**
     * 🔹 Lấy danh sách điểm danh theo sessionId
     */
    @Override
    public List<AttendanceItemDTO> getAttendanceBySession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        int order = session.getOrderSession();
        Long courseId = session.getCourse().getId();

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);
        if (courseStudents.isEmpty()) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }

        return courseStudents.stream().map(cs -> {
            Student st = cs.getStudent();
            User u = st.getUser();
            Integer attendance = null;
            String note = null;

            try {
                List<AttendanceRecordDTO> list = objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {
                });
                if (order <= list.size() && list.get(order - 1) != null) {
                    attendance = list.get(order - 1).getStatus();
                    note = list.get(order - 1).getNote();
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            return AttendanceItemDTO.builder().id(st.getId()).code(st.getCode()).firstname(u.getFirstName()).lastname(u.getLastName()).gender(u.getGender()).dateofbirth(u.getDateOfBirth() != null ? u.getDateOfBirth().toString() : null).avatar(u.getAvatar()).attendance(attendance).note(note).build();
        }).toList();
    }

    /**
     * 🔹 Xem tổng hợp điểm danh toàn course
     */
    @Override
    public AttendanceSummaryDTO getAttendanceSummary(Long courseId) {
        List<Session> sessions = sessionRepository.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions.isEmpty()) throw new AppException(ErrorCode.SESSION_NOT_FOUND);

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);
        if (courseStudents.isEmpty()) throw new AppException(ErrorCode.COURSE_NOT_FOUND);

        // map sessions
        List<SessionInfoDTO> sessionInfos = sessions.stream().map(s -> SessionInfoDTO.builder().id(s.getId()).order(s.getOrderSession()).date(s.getDate() != null ? s.getDate().toString() : null).starttime(s.getStartTime() != null ? s.getStartTime().toString() : null).endtime(s.getEndTime() != null ? s.getEndTime().toString() : null).isabsent(s.isAbsent()).build()).toList();

        List<StudentInfoDTO> studentInfos = courseStudents.stream().map(cs -> {
            Student st = cs.getStudent();
            User u = st.getUser();
            List<AttendanceRecordDTO> attList = new ArrayList<>();
            try {
                attList = objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {
                });
            } catch (Exception e) {
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            return StudentInfoDTO.builder().id(st.getId()).code(st.getCode()).firstname(u.getFirstName()).lastname(u.getLastName()).avatar(u.getAvatar()).attendancelist(attList).build();
        }).toList();

        return AttendanceSummaryDTO.builder().sessions(sessionInfos).students(studentInfos).build();
    }

    @Override
    @Transactional
    public void markAttendance(MarkAttendanceRequest request) {
        Session session = sessionRepository.findById(request.getSessionId()).orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        int order = session.getOrderSession();
        Long courseId = session.getCourse().getId();

        for (AttendanceItemDTO dto : request.getStudents()) {
            CourseStudent cs = courseStudentRepository.findByCourseIdAndStudentId(courseId, dto.getId()).orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

            List<AttendanceRecordDTO> attList = new ArrayList<>();
            try {
                if (cs.getAttendanceList() != null) {
                    attList = objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {
                    });
                }
            } catch (Exception ignored) {
            }

            while (attList.size() < order) attList.add(null);

            attList.set(order - 1, AttendanceRecordDTO.builder().status(dto.getAttendance()).note(dto.getNote()).build());

            try {
                cs.setAttendanceList(objectMapper.writeValueAsString(attList));
            } catch (JsonProcessingException e) {
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            courseStudentRepository.save(cs);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAttendanceOverviewResponse getStudentAttendanceOverview() {
        Long studentId = currentUserService.requireStudentId();

        List<CourseStudent> courseStudents =
                courseStudentRepository.findByStudent_Id(studentId);

        int present = 0;
        int late = 0;
        int absent = 0;
        int excused = 0;

        for (CourseStudent cs : courseStudents) {
            String json = cs.getAttendanceList();
            if (json == null || json.isBlank()) continue;

            try {
                List<AttendanceItemDTO> items = objectMapper.readValue(
                        json,
                        new TypeReference<List<AttendanceItemDTO>>() {}
                );

                for (AttendanceItemDTO item : items) {
                    Integer st = item.getAttendance();
                    if (st == null) {
                        st = item.getStatus();   // 👈 ĐỌC FIELD status CŨ
                    }
                    if (st == null) continue;

                    // quy ước: 0 = Vắng, 1 = Có mặt, 2 = Trễ, 3 = Nghỉ có phép (nếu dùng)
                    switch (st) {
                        case 0 -> absent++;
                        case 1 -> present++;
                        case 2 -> late++;
                        case 3 -> excused++;
                        default -> {}
                    }
                }
            } catch (Exception e) {
                // log lỗi JSON nếu muốn, nhưng không văng exception
                // log.warn("Invalid attendance JSON for courseStudent {}", cs.getId(), e);
            }
        }

        int total = present + late + absent + excused;
        double rate = 0.0;
        if (total > 0) {
            int attended = present + late + excused;
            rate = attended * 100.0 / total;
        }

        return StudentAttendanceOverviewResponse.builder()
                .present(present)
                .late(late)
                .absent(absent)
                .excused(excused)
                .rate(rate)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAttendanceDetailDTO> getStudentAttendanceDetails(Long courseId) {
        Long studentId = currentUserService.requireStudentId();

        List<CourseStudent> csList;
        if (courseId != null) {
            csList = courseStudentRepository
                    .findByCourse_IdAndStudent_Id(courseId, studentId)
                    .map(List::of)
                    .orElse(List.of());
        } else {
            csList = courseStudentRepository.findByStudent_Id(studentId);
        }

        if (csList.isEmpty()) {
            return List.of();
        }

        List<StudentAttendanceDetailDTO> result = new java.util.ArrayList<>();

        for (CourseStudent cs : csList) {
            Course course = cs.getCourse();

            List<Session> sessions = sessionRepository
                    .findByCourse_IdOrderByDateAscStartTimeAsc(course.getId());

            java.util.List<AttendanceItemDTO> items;
            try {
                String json = cs.getAttendanceList();
                if (json == null || json.isBlank()) {
                    items = new java.util.ArrayList<>();
                } else {
                    items = objectMapper.readValue(
                            json,
                            new com.fasterxml.jackson.core.type.TypeReference<
                                    java.util.List<AttendanceItemDTO>>() {}
                    );
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
            }

            for (Session s : sessions) {
                int idx = (s.getOrderSession()) - 1;
                Integer status = null;
                String note = null;

                if (idx >= 0 && idx < items.size()) {
                    AttendanceItemDTO item = items.get(idx);
                    if (item != null) {
                        status = item.getStatus();
                        note = item.getNote();
                    }
                }

                StudentAttendanceDetailDTO dto = new StudentAttendanceDetailDTO();
                dto.setSessionId(s.getId());
                dto.setCourseId(course.getId());
                dto.setCourseTitle(course.getTitle());
                dto.setDate(s.getDate());
                dto.setStartTime(s.getStartTime());
                dto.setEndTime(s.getEndTime());
                dto.setAttendance(status);
                dto.setNote(note);

                result.add(dto);
            }
        }

        return result;
    }

}
