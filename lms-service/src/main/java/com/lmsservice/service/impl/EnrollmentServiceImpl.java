package com.lmsservice.service.impl;

import com.lmsservice.entity.*;
import com.lmsservice.repository.*;
import com.lmsservice.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentServiceImpl implements EnrollmentService {
    PendingEnrollmentRepository pendingRepo;
    EnrollmentRepository enrollmentRepo;
    ProgramRepository programRepo;
    SubjectRepository subjectRepo;
    StudentRepository studentRepo;
    UserRepository userRepo;
    RoleRepository roleRepo;
    PaymentHistoryRepository paymentHistoryRepo;

    @Transactional
    @Override
    public void confirmEnrollment(String txnRef) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Pending not found"));

        Enrollment enrollment = new Enrollment();

        // Lấy Student từ userId
        Student student = studentRepo.findByUserId(pending.getUserId())
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setId(pending.getUserId());
                    return studentRepo.save(s);
                });
        enrollment.setStudent(student);

        // Lấy Program
        if (pending.getProgramId() != null) {
            Program program = programRepo.findById(pending.getProgramId())
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            enrollment.setProgram(program);
        }

        // Lấy Subject
        if (pending.getSubjectId() != null) {
            Subject subject = subjectRepo.findById(pending.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            enrollment.setSubject(subject);
        }

        // Fee
        enrollment.setPaidFee(pending.getAmount());
        BigDecimal remaining = pending.getTotalFee().subtract(pending.getAmount());
        enrollment.setRemainingFee(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);

        Enrollment savedEnrollment = enrollmentRepo.save(enrollment);

        // Lưu PaymentHistory
        PaymentHistory ph = new PaymentHistory();
        ph.setEnrollment(savedEnrollment);
        ph.setAmount(pending.getAmount());
        ph.setTransactionStatus("SUCCESS");
        ph.setReferenceNumber(txnRef);
        ph.setPaymentMethod("VNPAY");
        ph.setPaymentDate(LocalDateTime.now());
        paymentHistoryRepo.save(ph);

        // Update role từ GUEST -> STUDENT nếu cần
        userRepo.findById(pending.getUserId()).ifPresent(user -> {
            roleRepo.findByName("STUDENT").ifPresent(role -> {
                if (user.getRole() == null || !role.equals(user.getRole())) {
                    user.setRole(role);
                    userRepo.save(user);
                }
            });
        });

        // Xóa pending
        pendingRepo.delete(pending);
    }

    @Transactional
    @Override
    public void cancelPending(String txnRef) {
        pendingRepo.findByTxnRef(txnRef).ifPresent(pending -> {
            // Có thể log lý do bị hủy
            pending.setStatus("CANCELLED");
            pendingRepo.save(pending);
        });
    }
}
