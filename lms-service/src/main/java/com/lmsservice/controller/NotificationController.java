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

    //Xem chi tiết 1 thông báo cụ thể
    @GetMapping("/{id}")
    public ApiResponse<NotificationResponse> getNotificationById(@PathVariable Long id) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Lấy thông báo chi tiết thành công")
                .result(notificationService.getById(id))
                .build();
    }

    //Đánh dấu tất cả thông báo là đã đọc
    @PutMapping("/seen-all")
    public ApiResponse<Void> markAllAsSeen() {
        notificationService.markAllAsSeen();
        return ApiResponse.<Void>builder()
                .message("Đã đánh dấu tất cả thông báo là đã đọc")
                .build();
    }

    //Đếm số lượng thông báo chưa đọc
    @GetMapping("/count-unseen")
    public ApiResponse<Long> countUnseenNotifications() {
        long count = notificationService.countUnseen();
        return ApiResponse.<Long>builder()
                .message("Số lượng thông báo chưa đọc")
                .result(count)
                .build();
    }

    //Xóa thông báo (chỉ của user hiện tại)
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ApiResponse.<Void>builder()
                .message("Đã xóa thông báo thành công")
                .build();
    }
}
