package com.lmsservice.controller;

import com.lmsservice.config.VnpayProps;
import com.lmsservice.dto.request.CreatePaymentRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.CreatePaymentResponse;
import com.lmsservice.entity.PendingEnrollment;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.PendingEnrollmentRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
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

        return ApiResponse.<CreatePaymentResponse>builder()
                .message("Tạo link thanh toán thành công")
                .result(new CreatePaymentResponse(paymentUrl, txnRef))
                .build();
    }

    // ----------------------------
    // 2. Callback (returnUrl) từ VNPAY
    // ----------------------------
    @GetMapping("/vnpay-return")
    @Operation(summary = "Xử lý callback trả về từ VNPAY sau khi người dùng hoàn tất thanh toán")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        Map<String, String> copy = new HashMap<>(params);
        boolean valid = vnpayService.verifySignature(copy);
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", "Invalid signature"));
        }

        String code = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        try {
            if ("00".equals(code)) {
                enrollmentPaymentService.finalizeSuccessfulPayment(txnRef, params);
                return ResponseEntity.ok(Map.of("status", "SUCCESS", "txnRef", txnRef));
            } else if ("24".equals(code)) {
                enrollmentPaymentService.markPendingCancelled(txnRef, "Cancelled by user");
                return ResponseEntity.ok(Map.of("status", "CANCELLED", "txnRef", txnRef, "reason", "User cancelled"));
            } else {
                enrollmentPaymentService.markPendingFailed(txnRef, code);
                return ResponseEntity.ok(Map.of("status", "FAILED", "txnRef", txnRef, "reason", "Transaction failed (" + code + ")"));
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(Map.of("status", "ALREADY_PROCESSED", "txnRef", txnRef));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("status", "ERROR", "message", ex.getMessage()));
        }
    }

    // ----------------------------
    // 3. IPN (server2server) từ VNPAY
    // ----------------------------
    @RequestMapping(value = "/vnpay-ipn", method = {RequestMethod.GET, RequestMethod.POST})
    @Operation(summary = "Xử lý IPN (Instant Payment Notification) từ VNPAY để xác nhận trạng thái thanh toán")
    public ResponseEntity<?> vnpayIpn(@RequestParam Map<String, String> params) {
        Map<String, String> copy = new HashMap<>(params);
        Map<String, String> resp = new HashMap<>();
        if (!vnpayService.verifySignature(copy)) {
            resp.put("RspCode", "97");
            resp.put("Message", "Invalid signature");
            return ResponseEntity.ok(resp);
        }
        String code = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        try {
            if ("00".equals(code)) {
                enrollmentPaymentService.finalizeSuccessfulPayment(txnRef, params);
                resp.put("RspCode", "00");
                resp.put("Message", "Confirm Success");
            } else if ("24".equals(code)) {
                enrollmentPaymentService.markPendingCancelled(txnRef, "Cancelled by user");
                resp.put("RspCode", "00");
                resp.put("Message", "Confirm Cancelled");
            } else {
                enrollmentPaymentService.markPendingFailed(txnRef, code);
                resp.put("RspCode", "00");
                resp.put("Message", "Confirm Failed");
            }
        } catch (IllegalStateException e) {
            resp.put("RspCode", "02");
            resp.put("Message", "Order already confirmed");
        } catch (Exception e) {
            resp.put("RspCode", "99");
            resp.put("Message", "Error: " + e.getMessage());
        }
        return ResponseEntity.ok(resp);
    }

    // ----------------------------
    // 4. Check trạng thái PendingEnrollment (FE có thể poll / fallback)
    // ----------------------------
    @GetMapping("/status/{txnRef}")
    @Operation(summary = "Lấy trạng thái giao dịch theo txnRef")
    public ResponseEntity<?> getStatus(@PathVariable String txnRef) {
        return pendingRepo.findByTxnRef(txnRef)
                .map(p -> ResponseEntity.ok(Map.of(
                        "txnRef", txnRef,
                        "status", p.getStatus()
                )))
                .orElse(ResponseEntity.status(404).body(Map.of("message", "Not found")));
    }
}
