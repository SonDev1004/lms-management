package com.lmsservice.service;

import com.lmsservice.dto.request.TuitionRevenueFilterRequest;
import com.lmsservice.dto.response.TuitionRevenueSummaryResponse;
import com.lmsservice.dto.response.TuitionTransactionResponse;

import java.util.List;

public interface TuitionRevenueService {

    TuitionRevenueSummaryResponse getMonthlySummary(TuitionRevenueFilterRequest filter);

    List<TuitionTransactionResponse> getMonthlyTransactions(TuitionRevenueFilterRequest filter);
}
