package com.lmsservice.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GenerateSessionsRequest {
    private LocalDate startDate;
    private Integer totalSessions;
}
