package com.lmsservice.entity;

import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)", unique = true)
    String name;

    @Column(columnDefinition = "nvarchar(255)")
    String description;

    @ManyToMany
    @JoinTable(
            name = "role_permission",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id"))
    Set<Permission> permissions;

    @OneToMany(mappedBy = "role")
    List<User> users;
}
