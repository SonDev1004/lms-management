package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAssignmentRetakeRequest {
    @NotBlank
    private String reason;
}

