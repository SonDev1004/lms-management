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
import com.lmsservice.util.CourseStudentStatus;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherCourseMapper {

    SessionRepository sessionRepository;
    StudentCourseMapper studentCourseMapper;

    public TeacherCourse toDto(Course course) {

        long sessionsDone = sessionRepository.countByCourseIdAndDateLessThanEqual(course.getId(), LocalDate.now());

        var base = studentCourseMapper.toDto(course, sessionsDone);

        int planned = base.getPlannedSession() == null ? 0 : base.getPlannedSession();
        List<TeacherCourse.StudentList> students = buildStudentList(course.getCourseStudents(), planned);
        int studentNumber = countActiveStudents(course.getCourseStudents());

        var statusEnum = course.getStatus();
        Integer statusCode = (statusEnum != null) ? statusEnum.getCode() : null;
        String statusText = (statusEnum != null) ? statusEnum.getTeacherText() : "Không xác định";

        Long staffId = (course.getStaff() != null) ? course.getStaff().getId() : null;
        String staffName = (course.getStaff() != null && course.getStaff().getUser() != null)
                ? course.getStaff().getUser().getFirstName() + " "
                        + course.getStaff().getUser().getLastName()
                : null;

        return TeacherCourse.builder()
                .courseId(base.getCourseId())
                .courseCode(base.getCourseCode())
                .courseTitle(base.getCourseTitle())
                .subjectId(base.getSubjectId())
                .subjectName(base.getSubjectName())
                .description(base.getDescription())
                .teacherId(base.getTeacherId())
                .teacherName(base.getTeacherName())
                .roomId(base.getRoomId())
                .roomName(base.getRoomName())
                .days(base.getDays())
                .daysText(base.getDaysText())
                .timeText(base.getTimeText())
                .startDate(base.getStartDate())
                .plannedSession(base.getPlannedSession())
                .sessionsDone(base.getSessionsDone())
                // Status teacher
                .status(statusCode)
                .statusText(statusText)
                // List student
                .studentNumber(studentNumber)
                .studentList(students)
                .staffId(staffId)
                .staffName(staffName)
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
                            .studentId((st != null) ? st.getId() : null)
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
                    }
                }
            }
            return cnt;
        } catch (Exception e) {
            return 0;
        }
    }
}
