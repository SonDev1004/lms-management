package com.lmsservice.controller;

import com.lmsservice.service.EnrollmentPaymentService;
import com.lmsservice.service.VnpayService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        boolean valid = vnpayService.verifySignature(params);
        if (!valid) return ResponseEntity.badRequest().body("Invalid signature");

        String code = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        if ("00".equals(code)) {
            try {
                enrollmentPaymentService.finalizeSuccessfulPayment(txnRef, params);
                return ResponseEntity.ok(Map.of("status","SUCCESS", "txnRef", txnRef));
            } catch (IllegalStateException e) {
                return ResponseEntity.ok(Map.of("status","ALREADY_PROCESSED", "txnRef", txnRef));
            } catch (Exception ex) {
                return ResponseEntity.status(500).body(Map.of("status","ERROR", "message", ex.getMessage()));
            }
        } else {
            enrollmentPaymentService.markPendingFailed(txnRef, code);
            String reason = switch (code) {
                case "24" -> "Cancelled by user";
                case "12" -> "Invalid transaction";
                default -> "Transaction failed (" + code + ")";
            };
            return ResponseEntity.ok(Map.of("status","FAILED", "reason", reason));
        }
    }

    @RequestMapping(value = "/vnpay-ipn", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> vnpayIpn(@RequestParam Map<String, String> params) {
        boolean valid = vnpayService.verifySignature(params);
        Map<String, String> resp = new HashMap<>();
        if (!valid) {
            resp.put("RspCode","97");
            resp.put("Message","Invalid signature");
            return ResponseEntity.ok(resp);
        }
        String code = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        try {
            if ("00".equals(code)) {
                enrollmentPaymentService.finalizeSuccessfulPayment(txnRef, params);
                resp.put("RspCode","00");
                resp.put("Message","Confirm Success");
            } else {
                enrollmentPaymentService.markPendingFailed(txnRef, code);
                resp.put("RspCode","00");
                resp.put("Message","Confirm Failed");
            }
        } catch (IllegalStateException e) {
            resp.put("RspCode","02");
            resp.put("Message","Order already confirmed");
        } catch (Exception e) {
            resp.put("RspCode","99");
            resp.put("Message","Error: " + e.getMessage());
        }
        return ResponseEntity.ok(resp);
    }
}

