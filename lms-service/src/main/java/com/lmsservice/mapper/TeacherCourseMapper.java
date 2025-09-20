package com.lmsservice.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.response.course.TeacherCourse;
import com.lmsservice.entity.*;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.util.CourseStatus;
import com.lmsservice.util.CourseStudentStatus;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherCourseMapper {

    SessionRepository sessionRepository;

    public TeacherCourse toDto(Course course) {
        int planned = course.getPlannedSession() == null ? 0 : course.getPlannedSession();

        long sessionDone = sessionRepository.countByCourseIdAndDateLessThanEqual(course.getId(), LocalDate.now());

        // map danh sách học viên
        List<TeacherCourse.StudentList> students = buildStudentList(course.getCourseStudents(), planned);

        // sĩ số học sinh trong lớp
        int studentNumber = countActiveStudents(course.getCourseStudents());

        // lấy status text
        CourseStatus statusEnum = course.getStatus(); // enum CourseStatus
        Integer statusCode = (statusEnum != null) ? statusEnum.getCode() : null;
        String statusText = (statusEnum != null) ? statusEnum.getTeacherText() : "Không xác định";

        return TeacherCourse.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseTitle(course.getTitle())
                .subjectId(course.getSubject() != null ? course.getSubject().getId() : null)
                .subjectName(course.getSubject() != null ? course.getSubject().getTitle() : null)
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(
                        course.getTeacher() != null && course.getTeacher().getUser() != null
                                ? (course.getTeacher().getUser().getFirstName() + " "
                                                + course.getTeacher().getUser().getLastName())
                                        .trim()
                                : null)
                .startDate(course.getStartDate())
                .plannedSession(planned)
                .sessionsDone((int) sessionDone)
                .status(statusCode)
                .statusText(statusText)

                // Dto listStudent
                .studentNumber(studentNumber)
                .studentList(students)
                .build();
    }

    // ===== Helper methods (internal use) =====

    // Tính sĩ số của lớp (các trạng thái được tính là đang/đã học)
    static int countActiveStudents(List<CourseStudent> list) {
        if (list == null || list.isEmpty()) return 0;
        Set<Integer> include = Set.of(
                CourseStudentStatus.ENROLLED.getCode(),
                CourseStudentStatus.IN_PROGRESS.getCode(),
                CourseStudentStatus.COMPLETED.getCode(),
                CourseStudentStatus.AUDIT.getCode());
        return (int) list.stream()
                .map(CourseStudent::getStatus) // Integer code
                .filter(Objects::nonNull)
                .filter(include::contains)
                .count();
    }

    // Map danh sách học viên
    static List<TeacherCourse.StudentList> buildStudentList(List<CourseStudent> csList, int plannedSessions) {
        if (csList == null || csList.isEmpty()) return List.of();

        return csList.stream()
                .map(cs -> {
                    Student st = cs.getStudent();
                    User u = (st != null) ? st.getUser() : null;

                    // lấy status của học sinh trong course
                    Integer statusCode = cs.getStatus();
                    CourseStudentStatus s = CourseStudentStatus.fromCode(statusCode);
                    String statusName = (s != null) ? s.getDisplay() : "Không xác định";

                    // Lấy chuyên cần
                    int presentCount = parsePresentCount(cs.getAttendanceList());

                    // full name
                    String fullName = (u != null ? u.getFirstName() + " " + u.getLastName() : null);

                    return TeacherCourse.StudentList.builder()
                            .studentCode((st != null) ? st.getCode() : null)
                            .studentName(fullName)
                            .studentPhone((u != null) ? u.getPhone() : null)
                            .studentEmail((u != null) ? u.getEmail() : null)
                            .status(statusCode)
                            .statusName(statusName)
                            .presentCount(presentCount)
                            .plannedSessions(plannedSessions)
                            .build();
                })
                .sorted(java.util.Comparator.comparing(sl -> sl.getStudentName() == null ? "" : sl.getStudentName()))
                .toList();
    }

    // Parse số buổi có mặt từ attendanceList dạng JSON (array các status int)
    static int parsePresentCount(String attendanceListJson) {
        if (attendanceListJson == null || attendanceListJson.isBlank()) return 0;

        try {
            var mapper = new ObjectMapper();
            var node = mapper.readTree(attendanceListJson);

            int cnt = 0;
            if (node.isArray()) {
                for (var it : node) {
                    int status = it.asInt(-1);
                    switch (status) {
                        case 1: // đi học
                        case 2: // đi trễ
                            cnt++;
                            break;
                        case 0: // vắng
                        default:
                            // do nothing
                    }
                }
            }
            return cnt;
        } catch (Exception e) {
            return 0;
        }
    }
}
