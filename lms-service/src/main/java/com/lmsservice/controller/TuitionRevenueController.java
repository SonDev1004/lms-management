package com.lmsservice.controller;

import com.lmsservice.dto.request.TuitionRevenueFilterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.TuitionRevenueSummaryResponse;
import com.lmsservice.dto.response.TuitionTransactionResponse;
import com.lmsservice.service.TuitionRevenueService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tuition-revenue")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN_IT')")
public class TuitionRevenueController {

    TuitionRevenueService tuitionRevenueService;


    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<TuitionRevenueSummaryResponse>> getSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) Long subjectId) {

        if (year == null || month == null) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<TuitionRevenueSummaryResponse>builder()
                            .code(HttpStatus.BAD_REQUEST.value())
                            .message("Missing required parameters: year and month")
                            .build()
            );
        }

        var filter = TuitionRevenueFilterRequest.builder()
                .year(year).month(month).status(status)
                .programId(programId).subjectId(subjectId).build();

        var summary = tuitionRevenueService.getMonthlySummary(filter);

        return ResponseEntity.ok(
                ApiResponse.<TuitionRevenueSummaryResponse>builder()
                        .code(HttpStatus.OK.value())
                        .result(summary)
                        .build()
        );
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TuitionTransactionResponse>>> getTransactions(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) Long subjectId) {

        if (year == null || month == null) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<List<TuitionTransactionResponse>>builder()
                            .code(HttpStatus.BAD_REQUEST.value())
                            .message("Missing required parameters: year and month")
                            .build()
            );
        }

        var filter = TuitionRevenueFilterRequest.builder()
                .year(year).month(month).status(status)
                .programId(programId).subjectId(subjectId).build();

        var rows = tuitionRevenueService.getMonthlyTransactions(filter);

        return ResponseEntity.ok(
                ApiResponse.<List<TuitionTransactionResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(rows)
                        .build()
        );
    }
}
