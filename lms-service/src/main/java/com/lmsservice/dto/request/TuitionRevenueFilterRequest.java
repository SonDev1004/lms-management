package com.lmsservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TuitionRevenueFilterRequest {

    Integer year;   // 2025
    Integer month;  // 6 = June

    String status;  // "ALL" | "SUCCESS" | "FAILED" (optional)
    Long programId; // lọc theo program (optional)
    Long subjectId; // lọc theo subject (optional)
}
