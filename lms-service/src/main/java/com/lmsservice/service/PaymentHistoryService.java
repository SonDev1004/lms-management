package com.lmsservice.service;

import com.lmsservice.repository.PaymentHistoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentHistoryService {
    PaymentHistoryRepository paymentHistoryRepository;
}

