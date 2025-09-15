package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class VnpayController {
    private final VnpayService vnpayService;
    private final EnrollmentPaymentService enrollmentPaymentService;

    @Value("${client.domain}")
    private String clientDomain;

    @Operation(
            summary = "Xử lý trả về từ VNPAY",
            description = "API này xử lý việc trả về từ VNPAY sau khi người dùng hoàn tất hoặc hủy thanh toán. "
                    + "Hệ thống sẽ xác thực chữ ký và cập nhật trạng thái thanh toán tương ứng trong hệ thống.")
    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<?>> vnpayReturn(@RequestParam Map<String, String> params) {
        Map<String, String> copy = new HashMap<>(params);
        boolean valid = vnpayService.verifySignature(copy);
        if (!valid) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .code(400)
                            .message("Invalid signature")
                            .result(Map.of("status", "ERROR", "message", "Invalid signature"))
                            .build()
            );
        }

        String code = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        try {
            if ("00".equals(code)) {
                enrollmentPaymentService.finalizeSuccessfulPayment(txnRef, params);
                return ResponseEntity.status(302)
                        .header("Location", clientDomain + "/payment-success?txnRef=" + txnRef)
                        .build();
            } else if ("24".equals(code)) { // user cancelled
                enrollmentPaymentService.markPendingCancelled(txnRef, "Cancelled by user");
                enrollmentPaymentService.markPendingCancelled(txnRef, "Cancelled by user");
                return ResponseEntity.status(302)
                        .header("Location", clientDomain + "/payment-cancelled?txnRef=" + txnRef)
                        .build();
            } else {
                enrollmentPaymentService.markPendingFailed(txnRef, code);
                String reason = switch (code) {
                    case "12" -> "Invalid transaction";
                    default -> "Transaction failed (" + code + ")";
                };
                return ResponseEntity.status(302)
                        .header("Location", clientDomain + "/payment-failed?txnRef=" + txnRef + "&reason=" + reason)
                        .build();
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .message("Already processed")
                            .result(Map.of("status", "ALREADY_PROCESSED", "txnRef", txnRef))
                            .build()
            );
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.builder()
                            .message(ex.getMessage())
                            .result(Map.of("status", "ERROR"))
                            .build()
            );
        }
    }

    @Operation(
            summary = "Xử lý IPN từ VNPAY",
            description = "API này xử lý các thông báo không đồng bộ (IPN) từ VNPAY về trạng thái thanh toán. "
                    + "Hệ thống sẽ xác thực chữ ký và cập nhật trạng thái thanh toán tương ứng trong hệ thống.")
    @RequestMapping(value = "/vnpay-ipn", method = {RequestMethod.GET, RequestMethod.POST})
    public ApiResponse<?> vnpayIpn(@RequestParam Map<String, String> params) {
        Map<String, String> resp = new HashMap<>();
        Map<String, String> copy = new HashMap<>(params);
        if (!vnpayService.verifySignature(copy)) {
            resp.put("RspCode", "97");
            resp.put("Message", "Invalid signature");
            return ApiResponse.builder()
                    .code(400)
                    .message("Invalid signature")
                    .result(resp)
                    .build();
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
        return ApiResponse.builder()
                .message("IPN processed")
                .result(resp)
                .build();
    }
}
