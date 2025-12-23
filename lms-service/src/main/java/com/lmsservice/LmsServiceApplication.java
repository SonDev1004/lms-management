package com.lmsservice;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication(scanBasePackages = "com.lmsservice")
@EnableScheduling
@EnableAspectJAutoProxy
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class LmsServiceApplication {
    @Value("${jwt.secretKey}")
    private String jwtSecret;

    public static void main(String[] args) {
        SpringApplication.run(LmsServiceApplication.class, args);
    }

    @PostConstruct
    public void test() {
        System.out.println("JJJJJWWWTTTT" + jwtSecret);
    }
}
