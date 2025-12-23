package com.lmsservice.controller;

import com.lmsservice.dto.request.CreateUserRequest;
import com.lmsservice.dto.request.SendNotificationRequest;
import com.lmsservice.dto.request.program.UpdateUserRequest;
import com.lmsservice.dto.response.*;
import com.lmsservice.entity.Permission;
import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;
import com.lmsservice.repository.RoleRepository;
import com.lmsservice.service.AdminItService;
import com.lmsservice.service.NotificationTypeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ApiResponse<Page<UserResponse>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false, name="keyword") String q,
            Pageable pageable
    ) {
        var page = service.getUsers(role, q, pageable);
        return ApiResponse.<Page<UserResponse>>builder()
                .code(1000)
                .message("Lấy danh sách người dùng thành công")
                .result(page)
                .build();
    }

    // Lấy thông tin user theo ID
    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .message("Get user successfully")
                .result(service.getUserById(id))
                .build();
    }
    // Update user
    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest req
    ) {
        return ApiResponse.<UserResponse>builder()
                .message("Cập nhật tài khoản thành công")
                .result(service.updateUser(id, req))
                .build();
    }

    // Xoá user
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ApiResponse.<Void>builder().message("Xoá tài khoản thành công").build();
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

    // Gán role cho user
    @PutMapping("/users/{userId}/role/{roleId}")
    public ApiResponse<UserResponse> assignRole(@PathVariable Long userId, @PathVariable Long roleId) {
        return ApiResponse.<UserResponse>builder()
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
    public ApiResponse<List<OptionDto>> getRoles() {
        var result = service.getAllRoles().stream()
                .map(r -> new OptionDto(r.getId().intValue(), r.getName()))
                .toList();

        return ApiResponse.<List<OptionDto>>builder()
                .message("Lấy danh sách vai trò thành công")
                .result(result)
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
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<Void> sendNotification(@RequestBody SendNotificationRequest req) {
        service.sendNotification(req);
        return ApiResponse.<Void>builder().message("Gửi thông báo thành công").build();
    }

    @GetMapping("/notifications/scheduled")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<NotificationResponse>> getScheduledNotifications() {
        List<NotificationResponse> result = service.getScheduledNotifications();
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo hẹn giờ thành công")
                .result(result)
                .build();
    }

    @GetMapping("/notifications/history")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
    public ApiResponse<List<NotificationResponse>> getNotificationHistory() {
        List<NotificationResponse> result = service.getNotificationHistory();
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy lịch sử thông báo thành công")
                .result(result)
                .build();
    }

    @GetMapping("/notifications/types")
    @PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
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
