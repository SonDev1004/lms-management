package com.lmsservice.mapper;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.lmsservice.dto.response.course.StudentCourse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseTimeslot;
import com.lmsservice.entity.Room;

@Component
public class StudentCourseMapper {

    /**
     * Map entity Course → DTO StudentCourse.
     *
     * @param course       entity khoá học
     * @param sessionsDone số buổi đã học (tính ở service để mapper không phụ thuộc repository)
     */
    public StudentCourse toDto(Course course, long sessionsDone) {
        // ===== Thông tin giáo viên =====
        Long teacherId = null;
        String teacherName = null;
        if (course.getTeacher() != null && course.getTeacher().getUser() != null) {
            teacherId = course.getTeacher().getId();
            var u = course.getTeacher().getUser();
            teacherName = joinName(u.getFirstName(), u.getLastName());
        }

        // ===== Timeslots đang active =====
        List<CourseTimeslot> active = Optional.ofNullable(course.getTimeslots())
                .orElseGet(List::of)
                .stream()
                .filter(ts -> Boolean.TRUE.equals(ts.getIsActive()))
                .toList();

        // ===== Ngày học trong tuần =====
        List<Integer> days = active.stream()
                .map(CourseTimeslot::getDayOfWeek)
                .distinct()
                .sorted()
                .toList();

        String dayText = days.isEmpty() ? null
                : days.stream().map(d -> "T" + d).collect(Collectors.joining("-"));

        // ===== Thời gian học =====
        String timeText = buildTimeText(active);

        // ===== Phòng học (lấy phòng đầu tiên nếu có) =====
        Long roomId = null;
        String roomName = null;
        Optional<Room> firstRoom = active.stream()
                .map(CourseTimeslot::getRoom)
                .filter(Objects::nonNull)
                .findFirst();
        if (firstRoom.isPresent()) {
            roomId = firstRoom.get().getId();
            roomName = firstRoom.get().getName();
        }

        // ===== Trạng thái lớp =====
        Integer status = course.getStatus();
        String statusText = switch (status == null ? -1 : status) {
            case 0 -> "Sắp khai giảng";
            case 1 -> "Đang học";
            case 2 -> "Đã học";
            default -> "Khác";
        };

        // ===== Build DTO =====
        return StudentCourse.builder()
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseTitle(course.getTitle())
                .subjectId(course.getSubject() != null ? course.getSubject().getId() : null)
                .subjectName(course.getSubject() != null ? course.getSubject().getTitle() : null)
                .description(course.getSubject() != null ? course.getSubject().getDescription() : null)
                .teacherId(teacherId)
                .teacherName(teacherName)
                .roomId(roomId)
                .roomName(roomName)
                .days(days)
                .daysText(dayText)
                .timeText(timeText)
                .startDate(course.getStartDate())
                .plannedSession(course.getPlannedSession())
                .sessionsDone((int) sessionsDone)
                .status(status)
                .statusText(statusText)
                .build();
    }

    /* ===== Helpers riêng của mapper ===== */

    private static String joinName(String first, String last) {
        List<String> parts = new ArrayList<>();
        if (first != null && !first.isBlank()) parts.add(first);
        if (last != null && !last.isBlank()) parts.add(last);
        return parts.isEmpty() ? null : String.join(" ", parts);
    }

    /**
     * - Nếu tất cả slot cùng giờ → "HH:mm-HH:mm"
     * - Nếu khác nhau → "08:00-10:00/19:00-21:00"
     */
    private static String buildTimeText(List<CourseTimeslot> active) {
        if (active == null || active.isEmpty()) return null;
        LocalTime s0 = active.get(0).getStartTime();
        LocalTime e0 = active.get(0).getEndTime();

        boolean allSame = active.stream()
                .allMatch(ts -> Objects.equals(ts.getStartTime(), s0)
                        && Objects.equals(ts.getEndTime(), e0));
        if (allSame) return fmt(s0) + "-" + fmt(e0);

        return active.stream()
                .map(ts -> fmt(ts.getStartTime()) + "-" + fmt(ts.getEndTime()))
                .distinct()
                .collect(Collectors.joining("/"));
    }

    private static String fmt(LocalTime t) {
        if (t == null) return "";
        return String.format("%02d:%02d", t.getHour(), t.getMinute());
    }
}

