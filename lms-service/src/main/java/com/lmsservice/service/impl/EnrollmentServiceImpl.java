package com.lmsservice.service.impl;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.LatestEnrollmentFilterRequest;
import com.lmsservice.dto.response.LatestEnrollmentItemResponse;
import com.lmsservice.entity.Enrollment;
import com.lmsservice.entity.PaymentHistory;
import com.lmsservice.repository.EnrollmentRepository;
import com.lmsservice.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentServiceImpl implements EnrollmentService {
    EnrollmentRepository enrollmentRepository;

    @Override
    public PageResponse<LatestEnrollmentItemResponse> getLatestEnrollments(
            LatestEnrollmentFilterRequest filter,
            Pageable pageable
    ) {
        Page<Enrollment> page = enrollmentRepository.findAll(pageable);

        return PageResponse.from(page.map(this::toDto));
    }

    private LatestEnrollmentItemResponse toDto(Enrollment e) {
        var student = e.getStudent();
        var user = student != null ? student.getUser() : null;
        var program = e.getProgram();
        var subject = e.getSubject();

        BigDecimal paidFee = e.getPaidFee() != null ? e.getPaidFee() : BigDecimal.ZERO;
        BigDecimal remainingFee = e.getRemainingFee() != null ? e.getRemainingFee() : BigDecimal.ZERO;

        // Tính payStatus dựa trên paidFee & remainingFee
        String payStatus;
        if (remainingFee.compareTo(BigDecimal.ZERO) <= 0 && paidFee.compareTo(BigDecimal.ZERO) > 0) {
            payStatus = "PAID";
        } else if (paidFee.compareTo(BigDecimal.ZERO) > 0 && remainingFee.compareTo(BigDecimal.ZERO) > 0) {
            payStatus = "PARTIAL";
        } else if (paidFee.compareTo(BigDecimal.ZERO) == 0 && remainingFee.compareTo(BigDecimal.ZERO) > 0) {
            payStatus = "UNPAID";
        } else {
            payStatus = "UNKNOWN";
        }
        String payMethod = null;
        java.time.LocalDateTime lastPaymentAt = null;

        List<PaymentHistory> phList = e.getPaymentHistories();
        if (phList != null && !phList.isEmpty()) {
            PaymentHistory latest = phList.stream()
                    .max(Comparator.comparing(PaymentHistory::getPaymentDate))
                    .orElse(null);

            if (latest != null) {
                payMethod = latest.getPaymentMethod();
                lastPaymentAt = latest.getPaymentDate();
            }
        }

        return LatestEnrollmentItemResponse.builder()
                .id(e.getId())
                .studentId(student != null ? student.getId() : null)
                .studentName(user != null ? user.getUserName() : null)
                .email(user != null ? user.getEmail() : null)
                .phone(user != null ? user.getPhone() : null)
                .programId(program != null ? program.getId() : null)
                .programTitle(program != null ? program.getTitle() : null)
                .subjectId(subject != null ? subject.getId() : null)
                .subjectTitle(subject != null ? subject.getTitle() : null)
                .paidFee(paidFee)
                .remainingFee(remainingFee)
                .payStatus(payStatus)
                .payMethod(payMethod)
                .lastPaymentAt(lastPaymentAt)
                .build();
    }
}
