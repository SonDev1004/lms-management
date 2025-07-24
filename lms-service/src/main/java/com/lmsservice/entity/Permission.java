package com.lmsservice.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Permission extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)", unique = true)
    String name;

    @Column(columnDefinition = "nvarchar(255)")
    String description;

    @Column(columnDefinition = "bit default 1", nullable = false)
    boolean isActive;

    @ManyToMany(mappedBy = "permissions")
    Set<Role> roles = new HashSet<>();
}
