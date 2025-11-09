package com.lmsservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lmsservice.controller.NotificationSocketController;
import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.entity.Notification;
import com.lmsservice.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationRepository notificationRepo;
    private final NotificationSocketController socketController;

    // Chạy mỗi phút
    @Scheduled(fixedRate = 60_000)
    public void dispatchScheduledNotifications() {
        LocalDateTime now = LocalDateTime.now();

        List<Notification> pending = notificationRepo.findPendingScheduledNotifications(now);
        if (pending.isEmpty()) return;

        pending.forEach(n -> {
            try {
                socketController.sendToUserId(
                        n.getUser().getId(),
                        NotificationResponse.builder()
                                .id(n.getId())
                                .title("[Hẹn giờ] " + n.getContent().replaceAll("<.*?>", ""))
                                .content(n.getContent())
                                .severity(n.getSeverity())
                                .isSeen(false)
                                .url(n.getUrl())
                                .type(n.getNotificationType().getTitle())
                                .postedDate(now)
                                .build()
                );

                n.setPostedDate(now);
                notificationRepo.save(n);

                log.info("✅ Gửi thông báo hẹn giờ id={} cho userId={} lúc {}",
                        n.getId(), n.getUser().getId(), now);
            } catch (Exception e) {
                log.error("⚠️ Lỗi gửi thông báo hẹn giờ id={}: {}", n.getId(), e.getMessage());
            }
        });
    }
}
