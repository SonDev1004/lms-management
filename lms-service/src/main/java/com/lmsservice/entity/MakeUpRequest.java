package com.lmsservice.entity;

import com.lmsservice.util.MakeUpRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "make_up_request",
        indexes = {
                @Index(name = "ux_mur_student_originalSession", columnList = "student_id, session_id", unique = true)
        }
)
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

    // ===================== NEW FIELDS (THEO FLYWAY V25) =====================

    // HS chọn buổi bù mong muốn (có thể null nếu bạn cho HS không chọn)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_session_id")
    Session preferredSession;

    // QLĐT duyệt buổi bù chính thức
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_session_id")
    Session approvedSession;

    // Course của session bù đã duyệt (để query nhanh / báo cáo)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_course_id")
    Course approvedCourse;

    @Column(name = "scheduled_at")
    LocalDateTime scheduledAt;

    @Column(name = "attended_at")
    LocalDateTime attendedAt;
}
