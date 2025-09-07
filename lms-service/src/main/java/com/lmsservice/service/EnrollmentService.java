package com.lmsservice.service;

public interface EnrollmentService {
    void confirmEnrollment(String txnRef);
    void cancelPending(String txnRef);
}


