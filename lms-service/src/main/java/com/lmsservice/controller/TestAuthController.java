package com.lmsservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAuthController {

    @GetMapping("/api/test-auth")
    public String test() {
        return "Test Auth Controller is working!";
    }
}
