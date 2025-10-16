package com.lmsservice.service;

import com.lmsservice.dto.response.NotificationResponse;

import java.util.List;


public interface NotificationService {
    List<NotificationResponse> getMyNotifications();
    List<NotificationResponse> getUnseenNotifications();
    void markAsSeen(Long notificationId);
}
