package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)", unique = true)
    String name;

    @Column(columnDefinition = "nvarchar(100)")
    String description;

    @ManyToMany
    @JoinTable(name = "RolePermission", joinColumns = @JoinColumn(name = "roleId"), inverseJoinColumns = @JoinColumn(name = "permissionId"))
    Set<Permission> permissions;

    @OneToMany(mappedBy = "role")
    List<User> users;
}
