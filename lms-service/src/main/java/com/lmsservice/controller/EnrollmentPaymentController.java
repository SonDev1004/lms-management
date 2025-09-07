package com.lmsservice.controller;

import com.lmsservice.config.VnpayProps;
import com.lmsservice.dto.request.CreatePaymentRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.CreatePaymentResponse;
import com.lmsservice.entity.PendingEnrollment;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @Operation(
            summary = "Tạo link thanh toán cho đăng ký học phần hoặc chương trình",
            description = "API này cho phép người dùng tạo link thanh toán để đăng ký học phần hoặc chương trình. "
                    + "Người dùng có thể chọn đăng ký một học phần hoặc một chương trình, không được chọn cả hai cùng lúc. "
                    + "Nếu không chọn gì, hệ thống sẽ trả về lỗi. "
                    + "Nếu số tiền gửi lên khác với phí của học phần/chương trình, hệ thống sẽ trả về lỗi."
    )
    @PostMapping("/create-payment")
    public ApiResponse<CreatePaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest req,
            HttpServletRequest servletRequest
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getUser().getId();

        // Kiểm tra input
        if ((req.getProgramId() == null && req.getSubjectId() == null) ||
                (req.getProgramId() != null && req.getSubjectId() != null)) {
            throw new AuthenticationException(ErrorCode.INVALID_REQUEST.getMessage()) {
            };
        }

        BigDecimal totalFee;
        if (req.getProgramId() != null) {
            Program p = programRepo.findById(req.getProgramId())
                    .orElseThrow(() -> new AuthenticationException(ErrorCode.PROGRAM_NOT_FOUND.getMessage()) {});
            totalFee = p.getFee();
        } else if (req.getSubjectId() != null) {
            Subject s = subjectRepo.findById(req.getSubjectId())
                    .orElseThrow(() -> new AuthenticationException(ErrorCode.SUBJECT_NOT_FOUND.getMessage()) {});
            totalFee = s.getFee();
        } else {
            throw new AuthenticationException(ErrorCode.INVALID_REQUEST.getMessage()) {};
        }

        // Nếu client không gửi amount thì mặc định lấy totalFee
        BigDecimal amount = req.getAmount() == null ? totalFee : req.getAmount();
        String txnRef = "PE-" + userId + "-" + System.currentTimeMillis();

        // Tạo PendingEnrollment để lưu trạng thái chờ
        PendingEnrollment pending = enrollmentPaymentService.createPending(
                userId, req.getProgramId(), req.getSubjectId(), amount, totalFee, txnRef
        );

        // Tạo URL thanh toán
        String orderInfo = "Enroll " + txnRef;
        String ipAddr = servletRequest.getHeader("X-Forwarded-For");
        if (ipAddr == null) ipAddr = servletRequest.getRemoteAddr();

        String paymentUrl = vnpayService.createPaymentUrl(amount, orderInfo, txnRef, ipAddr);

        // Trả về response chuẩn hóa
        return ApiResponse.<CreatePaymentResponse>builder()
                .message("Tạo link thanh toán thành công")
                .result(new CreatePaymentResponse(paymentUrl, txnRef))
                .build();
    }
}

