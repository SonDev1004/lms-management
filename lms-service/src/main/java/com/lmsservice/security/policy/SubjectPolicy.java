package com.lmsservice.security.policy;

import com.lmsservice.security.permission.PermissionNames;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class SubjectPolicy {
    private boolean has(Authentication auth, String permission) {
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if (permission.equals(ga.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    /** Có quyền này mới được xem cả inactive */
    public boolean canViewAll(Authentication auth) {
        return has(auth, PermissionNames.SUBJECT_VIEW_ALL);
    }
}
