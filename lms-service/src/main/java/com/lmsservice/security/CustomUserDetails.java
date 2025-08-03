package com.lmsservice.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.lmsservice.entity.User;

import lombok.Getter;

@Getter
// CustomUserDetails implements UserDetails để cung cấp thông tin người dùng cho Spring Security
// Nó chứa thông tin người dùng như tên đăng nhập, mật khẩu, quyền hạn và trạng thái tài khoản.
// Đây là lớp tùy chỉnh để mở rộng thông tin người dùng từ lớp User
// và cung cấp các quyền hạn và thông tin bổ sung cần thiết cho quá trình xác thực
// và phân quyền trong ứng dụng.
// Nó sẽ được sử dụng trong quá trình xác thực người dùng và phân quyền trong ứng dụng
// Spring Security.
// Lớp này sẽ được sử dụng trong quá trình xác thực người dùng và phân quyền
// trong ứng dụng Spring Security.
public class CustomUserDetails implements UserDetails {
    private final User user;
    private final List<GrantedAuthority> authorities;
    private final List<String> permissions;

    public CustomUserDetails(User user, List<GrantedAuthority> authorities, List<String> permissions) {
        this.user = user;
        this.authorities = authorities;
        this.permissions = permissions;
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActive();
    }
}
