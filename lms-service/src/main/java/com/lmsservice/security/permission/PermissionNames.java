package com.lmsservice.security.permission;

/**
 * PermissionNames
 * ----------------
 * Mục tiêu:
 * - Tập trung TÊN quyền (permission) vào 1 chỗ (avoid "magic string")
 * - Dùng chung cho: Policy (@PreAuthorize), seed DB role-permission, test, mapping JWT
 * <p>
 * Quy ước đặt tên:
 * - Dạng RESOURCE_ACTION, ví dụ: PROGRAM_VIEW_ALL, PROGRAM_SUBJECT_ASSIGN, SUBJECT_CREATE...
 * - Viết HOA, ngắn gọn, rõ nghĩa hành vi.
 * <p>
 * Cách thêm quyền mới:
 * 1) Thêm hằng số vào đây
 * 2) Seed vào bảng permission + gán cho role phù hợp (role_permission)
 * 3) Nếu cần check trong code: gọi từ ProgramPolicy/SubjectPolicy...
 * <p>
 * Ví dụ dùng trong SpEL:
 *
 * @PreAuthorize("hasAuthority(T(com.lmsservice.security.permission.PermissionNames).PROGRAM_VIEW_ALL)") Lưu ý:
 * - Đây CHỈ là nơi khai báo chuỗi quyền (constants). Nó không tự cấp quyền.
 * - Quyền thực tế được cấp qua DB (role_permission) và đưa vào GrantedAuthority/JWT khi login.
 */
public final class PermissionNames {
    private PermissionNames() {}

    // Program permissions
    public static final String PROGRAM_VIEW_ALL = "PROGRAM_VIEW_ALL";
    // Subject permissions
    public static final String SUBJECT_VIEW_ALL = "SUBJECT_VIEW_ALL";
}
