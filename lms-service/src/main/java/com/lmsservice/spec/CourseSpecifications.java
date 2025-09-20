package com.lmsservice.spec;

import java.util.Set;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.lmsservice.dto.request.course.StudentCourseFilterRequest;
import com.lmsservice.entity.*;

public final class CourseSpecifications {
    private CourseSpecifications() {}

    public static Specification<Course> forStudent(Long studentId, StudentCourseFilterRequest f) {
        return Specification
                // chỉ lấy các lớp mà học viên này đang/đã ghi danh (bảng course_student)
                .where(joinCourseStudent(studentId))
                // keyword: title/code course, subject.title, teacher.user.{firstName,lastName}
                .and(keyword(f.getKeyword()))
                // status, subject, teacher
                .and(equal("status", f.getStatus()))
                .and(equal("subject.id", f.getSubjectId()))
                .and(equal("teacher.id", f.getTeacherId()))
                // range startDate
                .and(SpecUtils.between("startDate", f.getStartDateFrom(), f.getStartDateTo()))
                // lọc theo ngày học & phòng (từ timeslot đang active)
                .and(byDaysOfWeek(f.getDaysOfWeek()))
                .and(byRoomId(f.getRoomId()));
    }

    private static Specification<Course> joinCourseStudent(Long studentId) {
        if (studentId == null) return null;
        return (root, q, cb) -> {
            Join<Course, CourseStudent> cs = root.join("courseStudents", JoinType.INNER);
            q.distinct(true);
            return cb.equal(cs.get("student").get("id"), studentId);
        };
    }

    private static Specification<Course> keyword(String kw) {
        if (kw == null || kw.isBlank()) return null;
        String like = "%" + kw.trim().toLowerCase() + "%";
        return (root, q, cb) -> {
            var subject = root.join("subject", JoinType.LEFT);
            var teacher = root.join("teacher", JoinType.LEFT);
            var user = teacher.join("user", JoinType.LEFT);

            Predicate byTitle = cb.like(cb.lower(root.get("title")), like);
            Predicate byCode = cb.like(cb.lower(root.get("code")), like);
            Predicate bySubject = cb.like(cb.lower(subject.get("title")), like);
            Predicate byTFirst = cb.like(cb.lower(user.get("firstName")), like);
            Predicate byTLast = cb.like(cb.lower(user.get("lastName")), like);

            q.distinct(true);
            return cb.or(byTitle, byCode, bySubject, byTFirst, byTLast);
        };
    }

    private static Specification<Course> byDaysOfWeek(Set<Integer> days) {
        if (days == null || days.isEmpty()) return null;
        return (root, q, cb) -> {
            Join<Course, CourseTimeslot> ts = root.join("timeslots", JoinType.INNER);
            q.distinct(true);
            return cb.and(cb.isTrue(ts.get("status")), ts.get("dayOfWeek").in(days));
        };
    }

    private static Specification<Course> byRoomId(Long roomId) {
        if (roomId == null) return null;
        return (root, q, cb) -> {
            Join<Course, CourseTimeslot> ts = root.join("timeslots", JoinType.INNER);
            q.distinct(true);
            return cb.and(cb.isTrue(ts.get("status")), cb.equal(ts.get("room").get("id"), roomId));
        };
    }

    /**
     * Helper equal (root path dạng "a.b.c")
     */
    private static <T> Specification<Course> equal(String path, T value) {
        return value == null ? null : SpecUtils.eq(path, value);
    }

    public static Specification<Course> forTeacher(Long teacherId, StudentCourseFilterRequest f) {
        return Specification
                // chỉ lấy các lớp do giáo viên này phụ trách
                .where(equal("teacher.id", teacherId))
                // keyword: title/code course, subject.title, teacher.user.{firstName,lastName}
                .and(keyword(f.getKeyword()))
                // status, subject
                .and(equal("status", f.getStatus()))
                .and(equal("subject.id", f.getSubjectId()))
                // có thể filter thêm theo teacherId trong request (cho admin dùng)
                .and(equal("teacher.id", f.getTeacherId()))
                // range startDate
                .and(SpecUtils.between("startDate", f.getStartDateFrom(), f.getStartDateTo()))
                // lọc theo ngày học & phòng (từ timeslot đang active)
                .and(byDaysOfWeek(f.getDaysOfWeek()))
                .and(byRoomId(f.getRoomId()));
    }
}
