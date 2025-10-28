package com.lmsservice.controller;

import com.lmsservice.dto.response.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import static lombok.AccessLevel.PRIVATE;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationSocketController {

    SimpMessagingTemplate messagingTemplate;

    public void sendToUser(Long userId, NotificationResponse noti) {
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, noti);
    }
}
