package com.lmsservice.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmsservice.dto.response.PaymentResultResponse;
import com.lmsservice.entity.*;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.*;
import com.lmsservice.service.EnrollmentPaymentService;

import lombok.RequiredArgsConstructor;

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

    // ✅ Tạo pending: lấy học phí gốc từ Program/Subject
    @Override
    public PendingEnrollment createPending(
            Long userId, Long programId, Long subjectId, BigDecimal totalFee, String txnRef) {

        if (pendingRepo.findByTxnRef(txnRef).isPresent()) {
            throw new IllegalArgumentException("Transaction reference already exists");
        }

        // Lấy giá gốc
        BigDecimal fee = null;
        if (programId != null) {
            fee = programRepo
                    .findById(programId)
                    .map(Program::getFee)
                    .orElseThrow(() -> new IllegalArgumentException("Program not found"));
        } else if (subjectId != null) {
            fee = subjectRepo
                    .findById(subjectId)
                    .map(Subject::getFee)
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        } else {
            throw new IllegalArgumentException("ProgramId or SubjectId required");
        }

        PendingEnrollment p = PendingEnrollment.builder()
                .txnRef(txnRef)
                .userId(userId)
                .programId(programId)
                .subjectId(subjectId)
                .amount(fee) // ✅ amount luôn = totalFee
                .totalFee(fee)
                .status("PENDING")
                .build();
        return pendingRepo.save(p);
    }

    // ✅ Xử lý thanh toán thành công (callback từ VNPAY)
    @Override
    @Transactional
    public Enrollment finalizeSuccessfulPayment(String txnRef, Map<String, String> vnpParams) {
        PendingEnrollment pending = pendingRepo
                .findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));

        if ("SUCCESS".equalsIgnoreCase(pending.getStatus())) {
            throw new IllegalStateException("Already processed");
        }

        BigDecimal paid = new BigDecimal(vnpParams.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        if (pending.getTotalFee().compareTo(paid) != 0) {
            throw new UnAuthorizeException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
        }

        Long userId = pending.getUserId();

        Student student = studentRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepo.findById(userId).orElseThrow(() -> new UnAuthorizeException(ErrorCode.USER_NOT_FOUND));
            Student s = new Student();
            s.setUser(user);
            return studentRepo.save(s);
        });

        Enrollment enr = new Enrollment();
        enr.setStudent(student);
        enr.setProgram(
                pending.getProgramId() != null
                        ? programRepo.findById(pending.getProgramId()).orElse(null)
                        : null);
        enr.setSubject(
                pending.getSubjectId() != null
                        ? subjectRepo.findById(pending.getSubjectId()).orElse(null)
                        : null);

        // ✅ full payment, remainingFee = 0
        enr.setPaidFee(pending.getTotalFee());
        enr.setRemainingFee(BigDecimal.ZERO);

        Enrollment savedEnr = enrollmentRepo.save(enr);

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

        pending.setStatus("SUCCESS");
        pendingRepo.save(pending);

        // Gán role STUDENT cho user
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
        PendingEnrollment pending = pendingRepo
                .findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));
        pending.setStatus("FAILED");
        pendingRepo.save(pending);
    }

    @Override
    @Transactional
    public void markPendingCancelled(String txnRef, String reason) {
        PendingEnrollment pending = pendingRepo
                .findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));
        pending.setStatus("CANCELLED");
        pendingRepo.save(pending);
    }

    // ✅ Timeout: chuyển PENDING sang EXPIRED
    @Scheduled(fixedRate = 60000)
    @Override
    @Transactional
    public void expirePendingEnrollments() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(15);
        List<PendingEnrollment> expired = pendingRepo.findAllByStatusAndCreatedAtBefore("PENDING", expiryTime);
        expired.forEach(p -> {
            p.setStatus("EXPIRED");
            pendingRepo.save(p);
        });
    }

    // ✅ API lấy kết quả
    @Override
    @Transactional(readOnly = true)
    public PaymentResultResponse getPaymentResult(String txnRef) {
        PendingEnrollment pending = pendingRepo
                .findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));

        var paymentHistoryOpt = paymentHistoryRepo.findByReferenceNumber(txnRef);

        Long enrollmentId =
                paymentHistoryOpt.map(ph -> ph.getEnrollment().getId()).orElse(null);

        String orderInfo = paymentHistoryOpt.map(PaymentHistory::getOrderInfo).orElse("Enroll " + txnRef);

        return PaymentResultResponse.builder()
                .txnRef(txnRef)
                .status(pending.getStatus())
                .totalFee(pending.getTotalFee()) // ✅ chỉ expose totalFee
                .programId(pending.getProgramId())
                .programName(
                        pending.getProgramId() != null
                                ? programRepo
                                        .findById(pending.getProgramId())
                                        .map(Program::getTitle)
                                        .orElse(null)
                                : null)
                .subjectId(pending.getSubjectId())
                .subjectName(
                        pending.getSubjectId() != null
                                ? subjectRepo
                                        .findById(pending.getSubjectId())
                                        .map(Subject::getTitle)
                                        .orElse(null)
                                : null)
                .enrollmentId(enrollmentId)
                .userId(pending.getUserId())
                .orderInfo(orderInfo)
                .currency("VND")
                .message(
                        "SUCCESS".equalsIgnoreCase(pending.getStatus())
                                ? "Thanh toán thành công"
                                : "Giao dịch " + pending.getStatus())
                .build();
    }
}
