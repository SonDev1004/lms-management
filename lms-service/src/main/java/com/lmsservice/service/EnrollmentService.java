package com.lmsservice.service;

import java.math.BigDecimal;
import java.util.List;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.EnrollmentRequestDTO;
import com.lmsservice.dto.response.EnrollmentResponseDTO;
import com.lmsservice.entity.*;
import com.lmsservice.repository.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class EnrollmentService {

    EnrollmentRepository enrollmentRepository;
    StudentRepository studentRepository;
    ProgramRepository programRepository;
    SubjectRepository subjectRepository;
    StaffRepository staffRepository;
    CurriculumRepository curriculumRepository;

    public EnrollmentResponseDTO registerEnrollment(EnrollmentRequestDTO request) {

        // ✅ Validate Student
        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Student với ID: " + request.getStudentId()));

        // ✅  Validate Staff (nếu có)
        Staff staff = (request.getStaffId() != null)
                ? staffRepository
                        .findById(request.getStaffId())
                        .orElseThrow(() -> new RuntimeException("Staff not found"))
                : null;

        // ✅  Validate Program
        Program program = null;
        if (request.getProgramId() != null) {
            program = programRepository
                    .findById(request.getProgramId())
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            if (program != null && !program.getIsActive()) {
                throw new IllegalStateException("Chương trình đã bị ngưng hoạt động.");
            }

            // Kiểm tra trùng đăng ký Program
            if (enrollmentRepository.existsByStudentIdAndProgramId(student.getId(), program.getId())) {
                throw new IllegalStateException("Học sinh đã đăng ký chương trình này.");
            }

            // Kiểm tra Student đã đăng ký môn lẻ nào thuộc Program chưa
            List<Long> subjectIds = curriculumRepository.findSubjectIdsByProgramId(program.getId());
            if (!subjectIds.isEmpty()
                    && enrollmentRepository.existsByStudentAndSubjectInProgram(student.getId(), subjectIds)) {
                throw new IllegalStateException(
                        "Học sinh đã đăng ký môn lẻ thuộc chương trình này, không thể đăng ký thêm.");
            }
        }

        // ✅  Validate Subject
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository
                    .findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));

            if (subject != null && !subject.getIsActive()) {
                throw new IllegalStateException("Môn học đã bị ngưng hoạt động.");
            }
            // Kiểm tra trùng đăng ký Subject
            if (enrollmentRepository.existsByStudentIdAndSubjectId (student.getId(), subject.getId())) {
                throw new IllegalStateException("Học sinh đã đăng ký môn học này.");
            }
            //  Kiểm tra học sinh đã đăng ký Program chứa Subject này chưa
            if (curriculumRepository.existsSubjectInStudentPrograms(student.getId(), subject.getId())) {
                throw new IllegalStateException("Học sinh đã đăng ký chương trình chứa môn học này, không thể đăng ký thêm môn lẻ.");
            }
        }

        // ✅  Tính học phí và validate Fee
        BigDecimal paidFee = request.getPaidFee() != null ? request.getPaidFee() : BigDecimal.ZERO;
        BigDecimal totalFee =
                (program != null) ? program.getFee() : (subject != null ? subject.getFee() : BigDecimal.ZERO);

        if (paidFee.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Paid fee không được âm.");
        }
        if (paidFee.compareTo(totalFee) > 0) {
            throw new IllegalArgumentException("Paid fee không được lớn hơn tổng học phí.");
        }

        BigDecimal remainingFee = totalFee.subtract(paidFee);

        // ✅  Lưu Enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setProgram(program);
        enrollment.setSubject(subject);
        enrollment.setStaff(staff);
        enrollment.setPaidFee(paidFee);
        enrollment.setRemainingFee(remainingFee);

        Enrollment saved = enrollmentRepository.save(enrollment);

        // ✅  Trả về DTO
        return EnrollmentResponseDTO.builder()
                .enrollmentId(saved.getId())
                .studentId(saved.getStudent().getId())
                .staffId(saved.getStaff() != null ? saved.getStaff().getId() : null)
                .programId(saved.getProgram() != null ? saved.getProgram().getId() : null)
                .subjectId(saved.getSubject() != null ? saved.getSubject().getId() : null)
                .paidFee(saved.getPaidFee())
                .remainingFee(saved.getRemainingFee())
                .build();
    }
}
