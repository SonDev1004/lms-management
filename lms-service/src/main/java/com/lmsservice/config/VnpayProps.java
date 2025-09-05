package com.lmsservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnpayProps {
    String tmnCode;
    String hashSecret;
    String payUrl;
    String returnUrl;
    String ipnUrl;
}
