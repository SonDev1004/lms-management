package com.lmsservice.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.CreateUserRequest;
import com.lmsservice.dto.request.SendNotificationRequest;
import com.lmsservice.dto.response.*;
import com.lmsservice.entity.Permission;
import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;
import com.lmsservice.repository.RoleRepository;
import com.lmsservice.service.AdminItService;
import com.lmsservice.service.NotificationTypeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin-it")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminItController {

    private final AdminItService service;
    private final NotificationTypeService notificationTypeService;
    private final RoleRepository roleRepo;

    /**
     * ------------------- USER -------------------
     **/

    // Lấy danh sách user (lọc theo role hoặc keyword)
    @GetMapping("/users")
    public ApiResponse<List<User>> getUsers(
            @RequestParam(required = false) String role, @RequestParam(required = false) String keyword) {
        return ApiResponse.<List<User>>builder()
                .message("Lấy danh sách người dùng thành công")
                .result(service.getUsers(role, keyword))
                .build();
    }

    // Tạo tài khoản mới
    @PostMapping("/users/create")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody CreateUserRequest req) {
        return ApiResponse.<UserResponse>builder()
                .message("Tạo tài khoản thành công")
                .result(service.createUser(req))
                .build();
    }

    // Xoá user
    @DeleteMapping("/users/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ApiResponse.<Void>builder().message("Xoá tài khoản thành công").build();
    }

    // Gán role cho user
    @PutMapping("/users/{userId}/role/{roleId}")
    public ApiResponse<User> assignRole(@PathVariable Long userId, @PathVariable Long roleId) {
        return ApiResponse.<User>builder()
                .message("Cập nhật vai trò cho tài khoản thành công")
                .result(service.updateUserRole(userId, roleId))
                .build();
    }

    /**
     * ------------------- ROLE -------------------
     **/

    // Lấy danh sách role
    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<Role>> getRoles() {
        return ApiResponse.<List<Role>>builder()
                .message("Lấy danh sách vai trò thành công")
                .result(service.getAllRoles())
                .build();
    }

    // Tạo role mới
    @PostMapping("/roles")
    public ApiResponse<Role> createRole(@RequestBody Role r) {
        return ApiResponse.<Role>builder()
                .message("Tạo vai trò mới thành công")
                .result(service.createRole(r))
                .build();
    }

    // Xoá role
    @DeleteMapping("/roles/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable Long id) {
        service.deleteRole(id);
        return ApiResponse.<Void>builder().message("Xoá vai trò thành công").build();
    }

    /**
     * ------------------- PERMISSION -------------------
     **/

    // Lấy danh sách quyền
    @GetMapping("/permissions")
    public ApiResponse<List<Permission>> getPermissions() {
        return ApiResponse.<List<Permission>>builder()
                .message("Lấy danh sách quyền thành công")
                .result(service.getAllPermissions())
                .build();
    }

    // Tạo quyền mới
    @PostMapping("/permissions")
    public ApiResponse<Permission> createPermission(@RequestBody Permission p) {
        return ApiResponse.<Permission>builder()
                .message("Tạo quyền mới thành công")
                .result(service.createPermission(p))
                .build();
    }

    // Xoá quyền
    @DeleteMapping("/permissions/{id}")
    public ApiResponse<Void> deletePermission(@PathVariable Long id) {
        service.deletePermission(id);
        return ApiResponse.<Void>builder().message("Xoá quyền thành công").build();
    }

    // Gán quyền cho role
    @PutMapping("/roles/{id}/permissions")
    public ApiResponse<Role> updatePermissions(@PathVariable Long id, @RequestBody List<Long> permIds) {
        return ApiResponse.<Role>builder()
                .message("Cập nhật quyền cho vai trò thành công")
                .result(service.assignPermissions(id, permIds))
                .build();
    }

    /**
     * ------------------- NOTIFICATION -------------------
     **/
    // gưi thông báo cho người dùng
    @PostMapping("/notifications/send")
    public ApiResponse<Void> sendNotification(@RequestBody SendNotificationRequest req) {
        service.sendNotification(req);
        return ApiResponse.<Void>builder().message("Gửi thông báo thành công").build();
    }

    // ✅ Lấy danh sách thông báo hẹn giờ (chưa gửi)
    @GetMapping("/notifications/scheduled")
    public ApiResponse<List<NotificationResponse>> getScheduledNotifications() {
        List<NotificationResponse> result = service.getScheduledNotifications();
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo hẹn giờ thành công")
                .result(result)
                .build();
    }

    @GetMapping("/notifications/types")
    public ApiResponse<List<OptionDto>> getNotificationTypes() {
        var types = notificationTypeService.getTypeOptions();
        return ApiResponse.<List<OptionDto>>builder()
                .message("Danh sách loại thông báo")
                .result(types)
                .build();
    }

    // options cho Roles (value là code chuỗi: STUDENT/TEACHER/STAFF/...)
    @GetMapping("/roles/options")
    public ApiResponse<List<OptionStringDto>> getRoleOptions() {
        var opts = roleRepo.findAll().stream()
                .map(r -> new OptionStringDto(r.getName(), r.getName()))
                .toList();
        return ApiResponse.<List<OptionStringDto>>builder()
                .message("Danh sách vai trò")
                .result(opts)
                .build();
    }
}
