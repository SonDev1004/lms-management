package com.lmsservice.service.impl;

import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.entity.Notification;
import com.lmsservice.entity.User;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.NotificationRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

    NotificationRepository notificationRepo;
    UserRepository userRepo;

    private String extractTitle(String html) {
        if (html == null) return "(Thông báo)";
        if (html.contains("<b>") && html.contains("</b>")) {
            int start = html.indexOf("<b>") + 3;
            int end = html.indexOf("</b>");
            return html.substring(start, end);
        }
        return "(Thông báo)";
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public List<NotificationResponse> getMyNotifications() {
        User user = getCurrentUser();
        return notificationRepo.findAllByUserId(user.getId())
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(extractTitle(n.getContent()))
                        .content(n.getContent())
                        .severity(n.getSeverity())
                        .isSeen(n.isSeen())
                        .url(n.getUrl())
                        .type(n.getNotificationType() != null ? n.getNotificationType().getTitle() : "General")
                        .postedDate(n.getPostedDate())
                        .build())
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnseenNotifications() {
        User user = getCurrentUser();
        return notificationRepo.findUnseenByUserId(user.getId())
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(extractTitle(n.getContent()))
                        .content(n.getContent())
                        .severity(n.getSeverity())
                        .isSeen(n.isSeen())
                        .url(n.getUrl())
                        .type(n.getNotificationType() != null ? n.getNotificationType().getTitle() : "General")
                        .postedDate(n.getPostedDate())
                        .build())
                .toList();
    }


    @Override
    public void markAsSeen(Long notificationId) {
        Notification n = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        n.setSeen(true);
        notificationRepo.save(n);
    }

    @Override
    public NotificationResponse getById(Long id) {
        User user = getCurrentUser();
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        // chỉ cho phép xem thông báo của chính user
        if (!n.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        return NotificationResponse.builder()
                .id(n.getId())
                .title(extractTitle(n.getContent()))
                .content(n.getContent())
                .severity(n.getSeverity())
                .isSeen(n.isSeen())
                .url(n.getUrl())
                .type(n.getNotificationType() != null ? n.getNotificationType().getTitle() : "General")
                .postedDate(n.getPostedDate())
                .build();
    }

    @Override
    public void markAllAsSeen() {
        User user = getCurrentUser();
        List<Notification> list = notificationRepo.findUnseenByUserId(user.getId());
        list.forEach(n -> n.setSeen(true));
        notificationRepo.saveAll(list);
    }

    @Override
    public long countUnseen() {
        User user = getCurrentUser();
        return notificationRepo.findUnseenByUserId(user.getId()).size();
    }

    @Override
    public void deleteNotification(Long id) {
        User user = getCurrentUser();
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!n.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        notificationRepo.delete(n);
    }

}
