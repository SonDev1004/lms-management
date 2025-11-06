package com.lmsservice.service;

public interface MailService {
    void sendMail(String to, String subject, String htmlBody);
}
