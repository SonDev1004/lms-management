package com.lmsservice.entity;

import com.lmsservice.util.MakeUpRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "make_up_request")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MakeUpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    Session session;  // buổi GỐC mà HS đã vắng

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    Course course;    // session.getCourse()

    @Column(name = "reason", length = 1000)
    String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    MakeUpRequestStatus status;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    // QLĐT xử lý
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_id")
    User processedBy;

    @Column(name = "processed_at")
    LocalDateTime processedAt;

    @Column(name = "admin_note", length = 1000)
    String adminNote;
}
