// package đổi lại cho đúng project của bạn
package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_bank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionBank extends EntityAbstract {

    // 1=MCQ 1 đáp án, 2=MCQ nhiều đáp án, 3=Fill-blank, 4=Listening MCQ, 5=Listening Fill-blank, 6=Essay
    @Column(name = "type", nullable = false)
    Integer type;

    // Nội dung câu hỏi (text chính / HTML)
    @Column(name = "content", columnDefinition = "nvarchar(max)", nullable = false)
    String content;

    // Danh sách option (MCQ) dạng JSON
    @Column(name = "options_json", columnDefinition = "nvarchar(max)")
    String optionsJson;

    // Đáp án chuẩn (JSON) cho auto-grade
    @Column(name = "answers_json", columnDefinition = "nvarchar(max)")
    String answersJson;

    // Link audio cho Listening
    @Column(name = "audio_url", columnDefinition = "nvarchar(512)")
    String audioUrl;

    // Môn học (có thể null)
    @ManyToOne
    @JoinColumn(name = "subject_id")
    Subject subject;

    // 0=private, 1=shared
    @Column(name = "visibility")
    Integer visibility;

    @Column(name = "is_active")
    Boolean isActive;

    // Người tạo – bảng dbo.[user]
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    User createdBy; // Đổi thành entity User thực tế trong project (có thể là AppUser, SystemUser,...)

    @Column(name = "created_at")
    LocalDateTime createdAt;
}
