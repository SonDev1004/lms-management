package com.lmsservice.security.policy;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import com.lmsservice.security.permission.PermissionNames;

/**
 * ProgramPolicy
 * -------------
 * Mục tiêu:
 *  - Gom logic kiểm tra quyền (authorization) cho domain "Program" vào 1 nơi.
 *  - Dùng trong @PreAuthorize hoặc gọi thẳng từ Service khi cần ép điều kiện ở tầng query (Specification).
 *
 * Cách sử dụng:
 *  - Dùng với @PreAuthorize (controller/service):
 *      @PreAuthorize("@programPolicy.canViewAll(authentication)")
 *      public PageResponse<ProgramResponse> exportAll(...) { ... }
 *
 *  - Dùng trực tiếp trong Service (ví dụ để ép isActive = true nếu thiếu quyền):
 *      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
 *      boolean canViewAll = programPolicy.canViewAll(auth);
 *      if (!canViewAll) { spec = spec.and(ProgramSpecifications.isActive(true)); }
 *
 * Lưu ý:
 *  - Kiểm tra dựa trên permission trong GrantedAuthority, KHÔNG dựa vào ROLE_.
 *  - Tên quyền lấy từ PermissionNames để tránh gõ sai.
 *  - Để @PreAuthorize hoạt động, đảm bảo đã bật @EnableMethodSecurity trong SecurityConfig.
 */
@Component("programPolicy") // tên bean sẽ dùng trong SpEL: @programPolicy
public class ProgramPolicy {

    // Helper: kiểm tra xem Authentication hiện tại có chứa permission mong muốn không
    private boolean has(Authentication auth, String perm) {
        if (auth == null || auth.getAuthorities() == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if (perm.equals(ga.getAuthority())) return true;
        }
        return false;
    }

    /**
     * Có quyền này mới xem được cả true + false (ví dụ: trả mọi Program bất kể isActive)
     * - Nếu KHÔNG có quyền: service nên ép isActive=true để bảo mật và đúng phân trang.
     */
    public boolean canViewAll(Authentication auth) {
        return has(auth, PermissionNames.PROGRAM_VIEW_ALL);
    }

    // Ví dụ mở rộng sau này:
    // public boolean canAssignSubject(Authentication auth) {
    //     return has(auth, PermissionNames.PROGRAM_SUBJECT_ASSIGN);
    // }
}
