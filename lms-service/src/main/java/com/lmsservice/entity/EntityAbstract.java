package com.lmsservice.entity;

import jakarta.persistence.*;

@MappedSuperclass
public abstract class EntityAbstract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}