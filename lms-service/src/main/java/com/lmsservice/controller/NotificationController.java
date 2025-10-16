package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    //Lấy tất cả thông báo của user hiện tại
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo thành công")
                .result(notificationService.getMyNotifications())
                .build();
    }

    //Lấy thông báo chưa đọc
    @GetMapping("/unseen")
    public ApiResponse<List<NotificationResponse>> getUnseenNotifications() {
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo chưa đọc thành công")
                .result(notificationService.getUnseenNotifications())
                .build();
    }

    //Đánh dấu đã xem
    @PutMapping("/{id}/seen")
    public ApiResponse<Void> markAsSeen(@PathVariable Long id) {
        notificationService.markAsSeen(id);
        return ApiResponse.<Void>builder()
                .message("Đã đánh dấu thông báo là đã đọc")
                .build();
    }
}
