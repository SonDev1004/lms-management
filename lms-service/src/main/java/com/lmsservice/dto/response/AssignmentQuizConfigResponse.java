package com.lmsservice.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class AssignmentQuizConfigResponse {
    private Long assignmentId;
    private String assignmentTitle;
    private List<AssignmentQuizConfigItemDto> items;
}
