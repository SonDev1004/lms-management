package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Permission extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)")
    String name;
    @Column(columnDefinition = "nvarchar(255)")
    String description;
    @Column(columnDefinition = "bit default 1")
    boolean isActive;

    @ManyToMany(mappedBy = "permissions")
    Set<Role> roles = new HashSet<>();
}
