package com.lmsservice.controller;

import com.lmsservice.config.VnpayProps;
import com.lmsservice.dto.request.CreatePaymentRequest;
import com.lmsservice.dto.response.CreatePaymentResponse;
import com.lmsservice.entity.PendingEnrollment;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;

import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentPaymentController {
    private final EnrollmentPaymentService enrollmentPaymentService;
    private final VnpayService vnpayService;
    private final ProgramRepository programRepo;
    private final SubjectRepository subjectRepo;
    private final VnpayProps vnpayProps;

    @PostMapping("/create-payment")
    public ResponseEntity<CreatePaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest req,
            HttpServletRequest servletRequest
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getUser().getId();

        BigDecimal totalFee = BigDecimal.ZERO;
        if (req.getProgramId() != null) {
            Program p = programRepo.findById(req.getProgramId()).orElseThrow();
            totalFee = p.getFee();
        } else if (req.getSubjectId() != null) {
            Subject s = subjectRepo.findById(req.getSubjectId()).orElseThrow();
            totalFee = s.getFee();
        } else {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal amount = req.getAmount() == null ? totalFee : req.getAmount();
        String txnRef = "PE-" + userId + "-" + System.currentTimeMillis();

        PendingEnrollment pending = enrollmentPaymentService.createPending(
                userId, req.getProgramId(), req.getSubjectId(), amount, totalFee, txnRef
        );

        String orderInfo = "Enroll " + txnRef;
        String ipAddr = servletRequest.getRemoteAddr();
        String paymentUrl = vnpayService.createPaymentUrl(amount, orderInfo, txnRef, ipAddr);

        return ResponseEntity.ok(new CreatePaymentResponse(paymentUrl, txnRef));
    }
}
