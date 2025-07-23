package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Setting extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)",nullable = false, unique = true)
    String name;
    @Column(columnDefinition = "nvarchar(255)",nullable = false)
    String value;
    @Column(columnDefinition = "nvarchar(255)")
    String description;

}
