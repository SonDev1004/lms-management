package com.lmsservice.service.impl;

import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseStudent;
import com.lmsservice.entity.Enrollment;
import com.lmsservice.entity.Student;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.EnrollmentRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.service.CourseStudentService;
import com.lmsservice.util.EnrollmentSource;
import com.lmsservice.util.CourseStatus;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class CourseStudentServiceImpl implements CourseStudentService {

    CourseStudentRepository courseStudentRepository;
    CourseRepository courseRepository;
    StudentRepository studentRepository;
    EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public void addStudentToCourse(Long courseId, Long studentId, EnrollmentSource source) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        // Course phải đang mở ghi danh → ENROLLING
        if (course.getStatus() != CourseStatus.ENROLLING) {
            throw new AppException(ErrorCode.COURSE_NOT_OPEN);
        }

        long current = courseStudentRepository.countByCourseId(courseId);
        if (current >= course.getCapacity()) {
            // đủ chỗ → chuyển sang WAITLIST
            course.setStatus(CourseStatus.WAITLIST);
            courseRepository.save(course);
            throw new AppException(ErrorCode.COURSE_FULL);
        }

        if (course.getStartDate() != null &&
                !LocalDate.now().isBefore(course.getStartDate())) {
            // đã tới / qua ngày bắt đầu → IN_PROGRESS, không cho add nữa
            course.setStatus(CourseStatus.IN_PROGRESS);
            courseRepository.save(course);
            throw new AppException(ErrorCode.COURSE_ALREADY_STARTED);
        }

        if (courseStudentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            return;
        }

        ensureEnrollment(course, student, source);

        CourseStudent cs = new CourseStudent();
        cs.setCourse(course);
        cs.setStudent(student);
        courseStudentRepository.save(cs);
    }

    private void ensureEnrollment(Course course, Student student, EnrollmentSource source) {
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndProgramIdAndSubjectId(
                        student.getId(),
                        course.getProgram().getId(),
                        course.getSubject().getId()
                ).orElse(null);

        if (enrollment == null) {
            enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setProgram(course.getProgram());
            enrollment.setSubject(course.getSubject());
            enrollment.setPaidFee(BigDecimal.ZERO);
            enrollment.setRemainingFee(course.getSubject().getFee());
            enrollmentRepository.save(enrollment);
        }

    }
}
