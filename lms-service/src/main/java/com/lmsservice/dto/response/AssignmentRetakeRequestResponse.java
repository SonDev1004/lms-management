package com.lmsservice.dto.response;

import com.lmsservice.entity.AssignmentRetakeRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssignmentRetakeRequestResponse {
    Long id;
    Long studentId;
    String studentCode;
    String studentName;
    String reason;
    String status; // PENDING / APPROVED / REJECTED
    LocalDateTime createdAt;
    LocalDateTime retakeDeadline;
    String adminNote;

    public static AssignmentRetakeRequestResponse fromEntity(AssignmentRetakeRequest e) {
        var dto = new AssignmentRetakeRequestResponse();
        dto.id = e.getId();
        dto.studentId = e.getStudent().getId();
        dto.studentCode = e.getStudent().getCode();
        dto.studentName = e.getStudent().getUser().getFirstName() + " " + e.getStudent().getUser().getLastName();
        dto.reason = e.getReason();
        dto.status = e.getStatus().name();
        dto.createdAt = e.getCreatedAt();
        dto.retakeDeadline = e.getRetakeDeadline();
        dto.adminNote = e.getAdminNote();
        return dto;
    }
}

