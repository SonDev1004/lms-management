package com.lmsservice.service.impl;

import static lombok.AccessLevel.PRIVATE;

import java.time.LocalDateTime;
import java.util.List;

import com.lmsservice.entity.NotificationType;
import com.lmsservice.repository.NotificationTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

    NotificationRepository notificationRepo;
    UserRepository userRepo;
    NotificationTypeRepository notificationTypeRepository;
    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

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
        return userRepo.findByUserName(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public List<NotificationResponse> getMyNotifications() {
        User user = getCurrentUser();
        return notificationRepo.findAllByUserId(user.getId()).stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(extractTitle(n.getContent()))
                        .content(n.getContent())
                        .severity(n.getSeverity())
                        .isSeen(n.isSeen())
                        .url(n.getUrl())
                        .type(
                                n.getNotificationType() != null
                                        ? n.getNotificationType().getTitle()
                                        : "General")
                        .postedDate(n.getPostedDate())
                        .build())
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnseenNotifications() {
        User user = getCurrentUser();
        return notificationRepo.findUnseenByUserId(user.getId()).stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(extractTitle(n.getContent()))
                        .content(n.getContent())
                        .severity(n.getSeverity())
                        .isSeen(n.isSeen())
                        .url(n.getUrl())
                        .type(
                                n.getNotificationType() != null
                                        ? n.getNotificationType().getTitle()
                                        : "General")
                        .postedDate(n.getPostedDate())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void markAsSeen(Long id) {
        User current = getCurrentUser();

        int updated = notificationRepo.markSeenByIdAndUser(id, current.getId());
        if (updated == 0) {
            throw new AppException(ErrorCode.NOTIFICATION_NOT_FOUND);
        }
    }


    @Override
    public NotificationResponse getById(Long id) {
        User user = getCurrentUser();
        Notification n =
                notificationRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
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
    @Transactional
    public void markAllAsSeen() {
        User user = getCurrentUser();
        notificationRepo.markAllSeenByUser(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnseen() {
        User user = getCurrentUser();
        return notificationRepo.countUnseenByUserId(user.getId());
    }

    @Override
    @Transactional
    public void deleteNotification(Long id) {
        User user = getCurrentUser();
        Notification n =
                notificationRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        notificationRepo.delete(n);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW, noRollbackFor = Exception.class)
    public NotificationResponse createForUser(Long userId, String title, String content, String url) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            log.warn("Skip notification: user {} not found", userId);
            return null;
        }

        NotificationType type = notificationTypeRepository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new IllegalStateException("No NotificationType defined in database"));

        Notification notification = Notification.builder()
                .user(user)
                .content(content != null ? content : title)
                .severity((short) 1)
                .url(url)
                .isSeen(false)
                .postedDate(LocalDateTime.now())
                .scheduledDate(null)
                .notificationType(type)
                .build();

        notification = notificationRepo.save(notification);

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(title != null ? title : extractTitle(notification.getContent()))
                .content(notification.getContent())
                .severity(notification.getSeverity())
                .url(notification.getUrl())
                .isSeen(notification.isSeen())
                .type(notification.getNotificationType().getTitle())
                .postedDate(notification.getPostedDate())
                .build();
    }

}
