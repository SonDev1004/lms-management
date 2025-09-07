package com.lmsservice.service.impl;

import com.lmsservice.entity.*;
import com.lmsservice.repository.*;
import com.lmsservice.service.EnrollmentPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EnrollmentPaymentServiceImpl implements EnrollmentPaymentService {

    private final PendingEnrollmentRepository pendingRepo;
    private final ProgramRepository programRepo;
    private final SubjectRepository subjectRepo;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final StudentRepository studentRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final PaymentHistoryRepository paymentHistoryRepo;

    @Override
    public PendingEnrollment createPending(Long userId, Long programId, Long subjectId,
                                           BigDecimal amount, BigDecimal totalFee, String txnRef) {
        if (pendingRepo.findByTxnRef(txnRef).isPresent()) {
            throw new IllegalArgumentException("Transaction reference already exists");
        }

        PendingEnrollment p = PendingEnrollment.builder()
                .txnRef(txnRef)
                .userId(userId)
                .programId(programId)
                .subjectId(subjectId)
                .amount(amount)
                .totalFee(totalFee)
                .status("PENDING")
                .build();
        return pendingRepo.save(p);
    }

    @Override
    @Transactional
    public Enrollment finalizeSuccessfulPayment(String txnRef, Map<String, String> vnpParams) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Pending enrollment not found"));

        if ("SUCCESS".equalsIgnoreCase(pending.getStatus())) {
            throw new IllegalStateException("Payment already processed");
        }

        BigDecimal paid = new BigDecimal(vnpParams.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        if (pending.getAmount().compareTo(paid) != 0) {
            throw new RuntimeException("Amount mismatch");
        }

        // Ensure student exists
        Long userId = pending.getUserId();

        Student student = studentRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Student s = new Student();
            s.setUser(user);
            return studentRepo.save(s);
        });

        // Create Enrollment
        Enrollment enr = new Enrollment();
        enr.setStudent(student);
        enr.setProgram(programRepo.findById(pending.getProgramId()).orElse(null));
        enr.setSubject(subjectRepo.findById(pending.getSubjectId()).orElse(null));
        enr.setPaidFee(paid);
        BigDecimal remaining = pending.getTotalFee().subtract(paid);
        enr.setRemainingFee(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);
        Enrollment savedEnr = enrollmentRepo.save(enr);

        // Log Payment History
        PaymentHistory ph = new PaymentHistory();
        ph.setEnrollment(savedEnr);
        ph.setAmount(paid);
        ph.setBankCode(vnpParams.get("vnp_BankCode"));
        ph.setBankTranNo(vnpParams.get("vnp_BankTranNo"));
        ph.setCardType(vnpParams.get("vnp_CardType"));
        ph.setOrderInfo(vnpParams.get("vnp_OrderInfo"));
        ph.setTransactionNo(vnpParams.get("vnp_TransactionNo"));
        ph.setResponseCode(vnpParams.get("vnp_ResponseCode"));
        ph.setTransactionStatus("SUCCESS");
        ph.setReferenceNumber(txnRef);
        ph.setPaymentMethod("VNPAY");
        ph.setPaymentDate(LocalDateTime.now());
        paymentHistoryRepo.save(ph);

        // Update Pending Status
        pending.setStatus("SUCCESS");
        pendingRepo.save(pending);

        // Update role GUEST -> STUDENT if necessary
        userRepo.findById(userId).ifPresent(user -> {
            roleRepo.findByName("STUDENT").ifPresent(role -> {
                if (user.getRole() == null || !role.equals(user.getRole())) {
                    user.setRole(role);
                    userRepo.save(user);
                }
            });
        });
        return savedEnr;
    }

    @Override
    @Transactional
    public void markPendingFailed(String txnRef, String reason) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Pending enrollment not found"));
        pending.setStatus("FAILED");
        pendingRepo.save(pending);
    }

    @Override
    @Transactional
    public void markPendingCancelled(String txnRef, String reason) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Pending enrollment not found"));
        pending.setStatus("CANCELLED");
        pendingRepo.save(pending);
    }
}
