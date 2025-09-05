package com.lmsservice.service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.stereotype.Service;

import com.lmsservice.config.VnpayProps;
import com.lmsservice.util.VnpayUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VnpayService {
    private final VnpayProps props;

    public String createPaymentUrl(BigDecimal amount, String orderInfo, String txnRef, String ipAddr) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", props.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount.multiply(BigDecimal.valueOf(100)).longValue()));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", props.getReturnUrl());
        params.put("vnp_IpAddr", ipAddr);
        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String name : fieldNames) {
            String value = params.get(name);
            if (!hashData.isEmpty()) hashData.append('&');
            hashData.append(URLEncoder.encode(name, StandardCharsets.UTF_8))
                    .append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8));
            if (!query.isEmpty()) query.append('&');
            query.append(URLEncoder.encode(name, StandardCharsets.UTF_8))
                    .append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8));
        }

        String secureHash = VnpayUtils.hmacSHA512(props.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=").append(secureHash);

        return props.getPayUrl() + "?" + query;
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (String name : fieldNames) {
            String value = params.get(name);
            if (!hashData.isEmpty()) hashData.append('&');
            hashData.append(URLEncoder.encode(name, StandardCharsets.UTF_8))
                    .append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8));
        }

        String calcHash = VnpayUtils.hmacSHA512(props.getHashSecret(), hashData.toString());
        return calcHash.equalsIgnoreCase(receivedHash);
    }
}

