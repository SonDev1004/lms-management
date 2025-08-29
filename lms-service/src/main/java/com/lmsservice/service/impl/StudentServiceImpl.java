package com.lmsservice.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.common.paging.PageableUtils;
import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.dto.response.course.StudentCourse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseTimeslot;
import com.lmsservice.entity.Room;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.service.StudentService;
import com.lmsservice.spec.CourseSpecifications;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service // Đánh dấu đây là 1 Spring Service (bean quản lý logic nghiệp vụ)
@RequiredArgsConstructor // Lombok: tự sinh constructor cho các field final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // tất cả field mặc định private + final
public class StudentServiceImpl implements StudentService {

    // Repository để query Course với Specification (filter/search/paging)
    CourseRepository courseRepository;

    // Repository để đếm số buổi học đã hoàn thành
    SessionRepository sessionRepository;

    @Override
    public PageResponse<StudentCourse> getCoursesByStudentId(
            Long studentId, StudentCourseFilterRequest filter, Pageable pageable) {
        // ===== 1. Build spec từ filter (keyword, subject, teacher, status, room, daysOfWeek) =====
        var spec = CourseSpecifications.forStudent(studentId, filter);

        // ===== 2. Chỉ cho phép sort theo field "root" của Course =====
        Set<String> whitelist =
                PageableUtils.toWhitelist("id", "title", "code", "status", "startDate", "plannedSession");
        Sort fallback = Sort.by(Sort.Order.desc("id")); // mặc định sort theo id DESC
        Pageable safe = PageableUtils.sanitizeSort(pageable, whitelist, fallback);

        // ===== 3. Query DB =====
        Page<Course> page = courseRepository.findAll(spec, safe);

        // ===== 4. Map entity → DTO =====
        Page<StudentCourse> dtoPage = page.map(this::toStudentCourseDto);

        // ===== 5. Trả về PageResponse cho FE =====
        return PageResponse.from(dtoPage);
    }

    /**
     * Hàm helper: chuyển từ entity Course sang DTO StudentCourse
     */
    private StudentCourse toStudentCourseDto(Course course) {
        /* ===== Lấy thông tin giáo viên ===== */
        Long teacherId = null;
        String teacherName = null;
        if (course.getTeacher() != null && course.getTeacher().getUser() != null) {
            teacherId = course.getTeacher().getId();
            var u = course.getTeacher().getUser();
            teacherName = joinName(u.getFirstName(), u.getLastName()); // ghép tên giáo viên
        }

        /* ===== Lấy danh sách timeslot đang active ===== */
        List<CourseTimeslot> active = Optional.ofNullable(course.getTimeslots())
                .orElseGet(List::of) // nếu null thì trả list rỗng
                .stream()
                .filter(ts -> Boolean.TRUE.equals(ts.getIsActive())) // chỉ lấy timeslot còn hiệu lực
                .toList();

        /* ===== Ngày học trong tuần ===== */
        List<Integer> days = active.stream()
                .map(CourseTimeslot::getDayOfWeek) // lấy thứ (2–7)
                .distinct() // loại trùng
                .sorted() // sắp xếp tăng dần
                .toList();

        // Text dạng "T2-T4-T6"
        String dayText = days.isEmpty() ? null : days.stream().map(d -> "T" + d).collect(Collectors.joining("-"));

        /* ===== Thời gian học ===== */
        String timeText = buildTimeText(active);

        /* ===== Phòng học ===== */
        Long roomId = null;
        String roomName = null;
        Optional<Room> firstRoom =
                active.stream().map(ts -> ts.getRoom()).filter(Objects::nonNull).findFirst();
        if (firstRoom.isPresent()) {
            roomId = firstRoom.get().getId();
            roomName = firstRoom.get().getName();
        }

        /* ===== Số buổi đã học ===== */
        long sessionsDone = sessionRepository.countByCourseIdAndDateLessThanEqual(course.getId(), LocalDate.now());

        /* ===== Trạng thái lớp ===== */
        Integer status = course.getStatus();
        String statusText =
                switch (status == null ? -1 : status) {
                    case 0 -> "Sắp khai giảng";
                    case 1 -> "Đang học";
                    case 2 -> "Đã học";
                    default -> "Khác";
                };

        /* ===== Trả về DTO cho FE ===== */
        return StudentCourse.builder()
                .courseId((course.getId()))
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

    /**
     * Ghép tên giáo viên (firstName + lastName)
     */
    private static String joinName(String first, String last) {
        List<String> parts = new ArrayList<>();
        if (first != null && !first.isBlank()) parts.add(first);
        if (last != null && !last.isBlank()) parts.add(last);
        return parts.isEmpty() ? null : String.join(" ", parts);
    }

    /**
     * Format thời gian học từ danh sách timeslot:
     * - Nếu tất cả slot cùng giờ → "HH:mm-HH:mm"
     * - Nếu khác nhau → "08:00-10:00/19:00-21:00"
     */
    private static String buildTimeText(List<CourseTimeslot> active) {
        if (active == null || active.isEmpty()) return null;
        LocalTime s0 = active.get(0).getStartTime();
        LocalTime e0 = active.get(0).getEndTime();

        // check nếu tất cả cùng giờ
        boolean allSame = active.stream()
                .allMatch(ts -> Objects.equals(ts.getStartTime(), s0) && Objects.equals(ts.getEndTime(), e0));
        if (allSame) return fmt(s0) + "-" + fmt(e0);

        // nếu nhiều khung giờ khác nhau thì nối lại
        return active.stream()
                .map(ts -> fmt(ts.getStartTime()) + "-" + fmt(ts.getEndTime()))
                .distinct()
                .collect(Collectors.joining("/"));
    }

    /**
     * Format LocalTime về dạng HH:mm
     */
    private static String fmt(LocalTime t) {
        if (t == null) return "";
        return String.format("%02d:%02d", t.getHour(), t.getMinute());
    }
}
