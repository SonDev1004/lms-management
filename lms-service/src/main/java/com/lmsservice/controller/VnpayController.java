package com.lmsservice.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class VnpayController {
    private final VnpayService vnpayService;
    private final EnrollmentPaymentService enrollmentPaymentService;

    @Operation(
            summary = "Xử lý trả về từ VNPAY",
            description = "API này xử lý việc trả về từ VNPAY sau khi người dùng hoàn tất hoặc hủy thanh toán. "
                    + "Hệ thống sẽ xác thực chữ ký và cập nhật trạng thái thanh toán tương ứng trong hệ thống.")
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        // dùng copy để tránh bị vnpayService.verifySignature() mutate params
        // vì params là unmodifiable map
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
                return ResponseEntity.status(302).header("Location", "http://localhost:5173/payment-success").build();
            } else if ("24".equals(code)) { // user cancelled
                enrollmentPaymentService.markPendingCancelled(txnRef, "Cancelled by user");
                return ResponseEntity.ok(Map.of("status", "CANCELLED", "txnRef", txnRef, "reason", "User cancelled"));
            } else {
                enrollmentPaymentService.markPendingFailed(txnRef, code);
                String reason = switch (code) {
                    case "12" -> "Invalid transaction";
                    default -> "Transaction failed (" + code + ")";
                };
                return ResponseEntity.ok(Map.of("status", "FAILED", "txnRef", txnRef, "reason", reason));
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(Map.of("status", "ALREADY_PROCESSED", "txnRef", txnRef));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("status", "ERROR", "message", ex.getMessage()));
        }
    }

    @Operation(
            summary = "Xử lý IPN từ VNPAY",
            description = "API này xử lý các thông báo không đồng bộ (IPN) từ VNPAY về trạng thái thanh toán. "
                    + "Hệ thống sẽ xác thực chữ ký và cập nhật trạng thái thanh toán tương ứng trong hệ thống.")
    @RequestMapping(value = "/vnpay-ipn", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> vnpayIpn(@RequestParam Map<String, String> params) {
        Map<String, String> resp = new HashMap<>();
        Map<String, String> copy = new HashMap<>(params);
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
}
