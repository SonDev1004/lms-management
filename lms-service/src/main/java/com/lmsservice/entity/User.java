package com.lmsservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table(name = "[User]")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)", nullable = false, unique = true)
    String userName;
    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    String password;
    @Column(columnDefinition = "nvarchar(255)")
    String firstName;
    @Column(columnDefinition = "nvarchar(255)")
    String lastName;
    LocalDate dateOfBirth;
    @Column(columnDefinition = "nvarchar(255)")
    String address;
    @Column(columnDefinition = "bit default 0")
    Boolean gender;
    // Ràng buộc với email và phone
    String email;
    @Column(columnDefinition = "varchar(15)", unique = true)
    String phone;
    @Column(columnDefinition = "nvarchar(255)")
    String avatar;

    LocalDateTime createdDate;

    @Column(columnDefinition = "bit default 1", nullable = false)
    Boolean isActive;

    @OneToMany(mappedBy = "user")
    List<Comment> comments;

    //Role
    @ManyToOne
    @JoinColumn(name = "roleId", nullable = false)
    Role role;

    //Notification
    @OneToMany(mappedBy = "user")
    List<Notification> notifications;

    //Log
    @OneToMany(mappedBy = "user")
    List<Log> logs;
}
