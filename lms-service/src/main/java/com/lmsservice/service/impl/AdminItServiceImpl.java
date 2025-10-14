package com.lmsservice.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.CreateUserRequest;
import com.lmsservice.dto.response.UserResponse;
import com.lmsservice.entity.Permission;
import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.PermissionRepository;
import com.lmsservice.repository.RoleRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.AdminItService;
import com.lmsservice.service.MailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminItServiceImpl implements AdminItService {

    UserRepository userRepo;
    RoleRepository roleRepo;
    PermissionRepository permRepo;
    PasswordEncoder encoder;
    MailService mailService;

    /**
     * ------------------- USER -------------------
     **/
    @Override
    public List<User> getUsers(String role, String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return userRepo.searchUsers(keyword);
        } else if (role != null && !role.isBlank()) {
            return userRepo.findByRole_NameIgnoreCase(role);
        } else {
            return userRepo.findAll();
        }
    }

    @Override
    public UserResponse createUser(CreateUserRequest req) {
        if (userRepo.existsByUserName(req.getUserName())) throw new AppException(ErrorCode.DUPLICATE_USER);

        String tempPassword = generateRandomPassword(8);
        Role role = roleRepo.findById(req.getRoleId()).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User u = new User();
        u.setUserName(req.getUserName());
        u.setEmail(req.getEmail());
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setPassword(encoder.encode(tempPassword));
        u.setRole(role);
        u.setIsActive(true);

        User saved = userRepo.save(u);
        sendAccountProvisionMail(saved, tempPassword);
        return UserResponse.builder()
                .id(saved.getId())
                .userName(saved.getUserName())
                .email(saved.getEmail())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .roleName(saved.getRole().getName())
                .build();
    }

    @Override
    public void sendAccountProvisionMail(User user, String tempPassword) {
        String html =
                """
					<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
						<h3 style="color:#2c3e50;">Xin chào %s,</h3>
						<p>
							Chúng tôi rất vui được thông báo rằng tài khoản của bạn trên hệ thống
							<strong>LMS Center</strong> đã được khởi tạo thành công.
						</p>

						<p>Thông tin đăng nhập của bạn như sau:</p>
						<ul style="list-style-type:none; padding:0;">
							<li><strong>Tên đăng nhập:</strong> %s</li>
							<li><strong>Mật khẩu tạm thời:</strong> %s</li>
						</ul>

						<p>
							Vui lòng truy cập vào
							<a href="http://localhost:5173/login"
							style="color:#335CFF; text-decoration:none; font-weight:bold;">
								LMS Center
							</a>
							để đăng nhập và đổi mật khẩu nhằm đảm bảo bảo mật thông tin cá nhân.
						</p>

						<p>
							Nếu bạn gặp bất kỳ khó khăn nào trong quá trình đăng nhập,
							vui lòng liên hệ với bộ phận hỗ trợ kỹ thuật của trung tâm để được trợ giúp kịp thời.
						</p>

						<br/>
						<p>Trân trọng,<br/>
						<strong>Phòng Quản trị Hệ thống – LMS Center</strong>
						</p>

						<hr style="border:none; border-top:1px solid #eee; margin-top:20px;"/>
						<p style="font-size:12px; color:#888;">
							Đây là email tự động, vui lòng không phản hồi trực tiếp.
							Nếu cần hỗ trợ, vui lòng liên hệ qua kênh hỗ trợ chính thức của trung tâm.
						</p>
					</div>
				"""
                        .formatted(user.getFirstName() + " " + user.getLastName(), user.getUserName(), tempPassword);

        mailService.sendMail(user.getEmail(), "[LMS Center] Cấp tài khoản mới", html);
    }

    @Override
    public String generateRandomPassword(int len) {
        return java.util.UUID.randomUUID().toString().replace("-", "").substring(0, len);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) throw new AppException(ErrorCode.USER_NOT_FOUND);

        userRepo.deleteById(id);
    }

    @Override
    public User updateUserRole(Long userId, Long roleId) {
        User u = userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Role r = roleRepo.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED_ACCESS_ROLE));
        u.setRole(r);
        return userRepo.save(u);
    }

    /**
     * ------------------- ROLE -------------------
     **/
    @Override
    public List<Role> getAllRoles() {
        return roleRepo.findAll();
    }

    @Override
    public Role createRole(Role r) {
        if (roleRepo.existsByName(r.getName())) throw new AppException(ErrorCode.DUPLICATE_PROGRAM_TITLE);
        return roleRepo.save(r);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepo.existsById(id)) throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS_ROLE);
        roleRepo.deleteById(id);
    }

    /**
     * ------------------- PERMISSION -------------------
     **/
    @Override
    public List<Permission> getAllPermissions() {
        return permRepo.findAll();
    }

    @Override
    public Permission createPermission(Permission p) {
        if (permRepo.existsByName(p.getName())) throw new AppException(ErrorCode.INVALID_REQUEST);
        p.setActive(true);
        return permRepo.save(p);
    }

    @Override
    public void deletePermission(Long id) {
        if (!permRepo.existsById(id)) throw new AppException(ErrorCode.INVALID_REQUEST);
        permRepo.deleteById(id);
    }

    /**
     * ------------------- ASSIGN -------------------
     **/
    @Override
    public Role assignPermissions(Long roleId, List<Long> permIds) {
        Role role = roleRepo.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED_ACCESS_ROLE));

        Set<Permission> perms = new HashSet<>(permRepo.findAllById(permIds));

        if (perms.isEmpty()) throw new AppException(ErrorCode.INVALID_REQUEST);

        role.setPermissions(perms);
        return roleRepo.save(role);
    }
}
