package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.response.NotificationResponse;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications();

    List<NotificationResponse> getUnseenNotifications();

    void markAsSeen(Long notificationId);

    NotificationResponse getById(Long id);

    void markAllAsSeen();

    long countUnseen();

    void deleteNotification(Long id);
}
