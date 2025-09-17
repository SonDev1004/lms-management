package com.lmsservice.controller;

import com.lmsservice.config.VnpayProps;
import com.lmsservice.dto.request.CreatePaymentRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.CreatePaymentResponse;
import com.lmsservice.dto.response.PaymentResultResponse;
import com.lmsservice.entity.PendingEnrollment;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.EnrollmentRepository;
import com.lmsservice.repository.PendingEnrollmentRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentPaymentController {
    private final EnrollmentPaymentService enrollmentPaymentService;
    private final VnpayService vnpayService;
    private final ProgramRepository programRepo;
    private final SubjectRepository subjectRepo;
    private final PendingEnrollmentRepository pendingRepo;
    private final VnpayProps vnpayProps;
    private final EnrollmentPaymentService enrollmentRepo;

    // ----------------------------
    // 1. Tạo link thanh toán
    // ----------------------------
    @PostMapping("/create-payment")
    @Operation(summary = "Tạo link thanh toán cho đăng ký học phần hoặc chương trình")
    public ApiResponse<CreatePaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest req,
            HttpServletRequest servletRequest
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getUser().getId();

        if ((req.getProgramId() == null && req.getSubjectId() == null)
                || (req.getProgramId() != null && req.getSubjectId() != null)) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        BigDecimal totalFee;
        if (req.getProgramId() != null) {
            Program p = programRepo.findById(req.getProgramId())
                    .orElseThrow(() -> new AppException(ErrorCode.PROGRAM_NOT_FOUND));
            totalFee = p.getFee();
        } else {
            Subject s = subjectRepo.findById(req.getSubjectId())
                    .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
            totalFee = s.getFee();
        }

        BigDecimal amount = req.getAmount() == null ? totalFee : req.getAmount();
        String txnRef = "PE-" + userId + "-" + System.currentTimeMillis();

        PendingEnrollment pending = enrollmentPaymentService.createPending(
                userId, req.getProgramId(), req.getSubjectId(), amount, totalFee, txnRef);

        String orderInfo = "Enroll " + txnRef;
        String ipAddr = servletRequest.getHeader("X-Forwarded-For");
        if (ipAddr == null) ipAddr = servletRequest.getRemoteAddr();

        String paymentUrl = vnpayService.createPaymentUrl(amount, orderInfo, txnRef, ipAddr);

        CreatePaymentResponse response = CreatePaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .txnRef(txnRef)
                .id(pending.getId())
                .status(pending.getStatus())
                .totalFee(totalFee)
                .amount(amount)
                .currency("VND")
                .createdAt(pending.getCreatedAt())
                .expiresAt(pending.getCreatedAt().plusMinutes(vnpayProps.getTimeoutMinutes()))
                .timeoutSeconds(vnpayProps.getTimeoutMinutes() * 60)
                .userId(userId)
                .programName(req.getProgramId() != null
                        ? programRepo.findById(req.getProgramId()).map(Program::getTitle).orElse(null)
                        : null)
                .subjectName(req.getSubjectId() != null
                        ? subjectRepo.findById(req.getSubjectId()).map(Subject::getTitle).orElse(null)
                        : null)
                .orderInfo(orderInfo)
                .locale("vn")
                .build();

        return ApiResponse.<CreatePaymentResponse>builder()
                .message("Tạo link thanh toán thành công")
                .result(response)
                .build();

    }

    // ----------------------------
    // 2. Check trạng thái PendingEnrollment (FE có thể poll / fallback)
    // ----------------------------
    @GetMapping("/status/{txnRef}")
    @Operation(summary = "Lấy trạng thái giao dịch theo txnRef")
    public ApiResponse<?> getStatus(@PathVariable String txnRef) {
        return pendingRepo.findByTxnRef(txnRef)
                .map(p -> ApiResponse.builder()
                        .message("Found")
                        .result(Map.of(
                                "txnRef", txnRef,
                                "status", p.getStatus()
                        ))
                        .build())
                .orElse(ApiResponse.builder()
                        .message("Not found")
                        .result(null)
                        .build());
    }

    @GetMapping("/result/{txnRef}")
    @Operation(summary = "Lấy kết quả thanh toán theo txnRef")
    public ApiResponse<PaymentResultResponse> getPaymentResult(@PathVariable String txnRef) {
        PaymentResultResponse result = enrollmentRepo.getPaymentResult(txnRef);
        if (result == null) {
            throw new AppException(ErrorCode.PAYMENT_NOT_FOUND);
        }
        return ApiResponse.<PaymentResultResponse>builder()
                .message("Lấy kết quả thanh toán thành công")
                .result(result)
                .build();
    }



}




