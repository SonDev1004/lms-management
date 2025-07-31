package com.lmsservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.StaffService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/staff")
public class StaffController {
    StaffService staffService;

    @GetMapping("/ACADEMIC_MANAGER")
    public String getAcademicManager() {
        return "Hello, Academic Manager!";
    }

    @GetMapping("/ADMIN_IT")
    public String getAdminIT() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getUserId();
        System.out.println("User ID: " + userId);
        return "Hello, Admin IT!";
    }
}
