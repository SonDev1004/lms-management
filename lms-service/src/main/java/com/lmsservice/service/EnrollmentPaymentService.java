package com.lmsservice.service;

import com.lmsservice.entity.Enrollment;
import com.lmsservice.entity.PendingEnrollment;

import java.math.BigDecimal;
import java.util.Map;

public interface EnrollmentPaymentService {
    PendingEnrollment createPending(Long userId, Long programId, Long subjectId,
                                    BigDecimal amount, BigDecimal totalFee, String txnRef);

    Enrollment finalizeSuccessfulPayment(String txnRef, Map<String, String> vnpParams);

    void markPendingFailed(String txnRef, String reason);

    void markPendingCancelled(String txnRef, String reason);
}
