package com.lmsservice.controller;

import static lombok.AccessLevel.PRIVATE;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.entity.User;
import com.lmsservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationSocketController {

    SimpMessagingTemplate messagingTemplate;
    UserRepository userRepository;

    /** Gửi riêng cho một user theo username (trùng Principal#getName()). */
    public void sendToUsername(String username, NotificationResponse noti) {
        // ĐÚNG CHUẨN user-destination
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", noti);
    }

    /** Nếu đang cầm userId -> map sang username trước khi gửi. */
    public void sendToUserId(Long userId, NotificationResponse noti) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // CHÚ Ý: giá trị này PHẢI trùng với Authentication#getName() bạn set ở CONNECT
        String principalName = user.getUserName(); // hoặc user.getEmail() tuỳ bạn chọn làm Principal
        sendToUsername(principalName, noti);
    }

    /** (Tuỳ chọn) Broadcast cho tất cả mọi người. */
    public void broadcast(NotificationResponse noti) {
        messagingTemplate.convertAndSend("/topic/notifications", noti);
    }
}
