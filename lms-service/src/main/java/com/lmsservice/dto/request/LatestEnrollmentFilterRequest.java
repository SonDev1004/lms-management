package com.lmsservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LatestEnrollmentFilterRequest {
    String query;       // name / email / phone / mã HV
    String payStatus;   // PAID / PARTIAL / UNPAID / REFUNDED
    Long programId;
    Long subjectId;
    LocalDate fromDate;
    LocalDate toDate;
}
