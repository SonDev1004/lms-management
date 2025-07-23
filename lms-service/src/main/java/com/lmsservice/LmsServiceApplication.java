package com.lmsservice;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
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
