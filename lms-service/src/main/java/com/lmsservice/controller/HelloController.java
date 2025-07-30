package com.lmsservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/test")
public class HelloController {

    public HelloController() {}

    @Operation(summary = "Test API", description = "Mô tả chi tiết về API này")
    @GetMapping("/hello")
    public String hello() {
        return "Hello, LMS Service!";
    }
}
