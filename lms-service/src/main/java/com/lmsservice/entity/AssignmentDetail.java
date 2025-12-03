package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "assignment_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentDetail extends EntityAbstract {

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    QuestionBank question;

    // Cột trong DB là [order] (tên thực là order, [] chỉ là escape của SQL Server)
    @Column(name = "[order]", nullable = false)
    Short orderNumber;

    @Column(name = "points", precision = 5, scale = 2, nullable = false)
    BigDecimal points;

    // Snapshot câu hỏi tại thời điểm publish (JSON)
    @Column(name = "question_snapshot_json", columnDefinition = "nvarchar(max)")
    String questionSnapshotJson;
}
