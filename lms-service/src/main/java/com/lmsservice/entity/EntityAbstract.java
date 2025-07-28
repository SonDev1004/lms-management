package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@MappedSuperclass
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PROTECTED)
public abstract class EntityAbstract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
}
