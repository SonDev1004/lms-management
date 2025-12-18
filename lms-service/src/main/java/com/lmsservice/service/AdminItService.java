package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.request.CreateUserRequest;
import com.lmsservice.dto.request.SendNotificationRequest;
import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.dto.response.UserResponse;
import com.lmsservice.entity.Permission;
import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;

public interface AdminItService {
    /**
     * ------------------- USER -------------------
     **/
    List<User> getUsers(String role, String keyword);

    UserResponse createUser(CreateUserRequest req);

    void sendAccountProvisionMail(User user, String tempPassword);

    String generateRandomPassword(int len);

    void deleteUser(Long id);

    User updateUserRole(Long userId, Long roleId);

    /**
     * ------------------- ROLE -------------------
     **/
    List<Role> getAllRoles();

    Role createRole(Role r);

    void deleteRole(Long id);

    /**
     * ------------------- PERMISSION -------------------
     **/
    List<Permission> getAllPermissions();

    Permission createPermission(Permission p);

    void deletePermission(Long id);

    /**
     * ------------------- ASSIGN -------------------
     **/
    Role assignPermissions(Long roleId, List<Long> permIds);

    /**
     * ------------------- NOTIFICATION -------------------
     **/
    void sendNotification(SendNotificationRequest req);

    List<NotificationResponse> getScheduledNotifications();

    List<NotificationResponse> getNotificationHistory();
}
