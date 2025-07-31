package com.lmsservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lmsservice.entity.User;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository
                .findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<String> permissionNames =
                user.getRole().getPermissions().stream().map(p -> p.getName()).toList();

        List<GrantedAuthority> authorities =
                permissionNames.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

        return new CustomUserDetails(user, authorities, permissionNames);
    }
}
