package com.lmsservice.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)")
    String location;

    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String name;

    @Column(columnDefinition = "tinyint")
    Short capacity;

    @Column(columnDefinition = "bit default 0", nullable = false)
    boolean isAvailable;

    // Sessions
    @OneToMany(mappedBy = "room")
    List<Session> sessions;
}
