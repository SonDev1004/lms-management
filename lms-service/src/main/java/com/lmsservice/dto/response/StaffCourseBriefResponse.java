package com.lmsservice.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffCourseBriefResponse {
    Long courseId;
    String code;
    String name;
    String status;     // optional
    String startDate;  // optional (string cho nhanh)
    String endDate;    // optional
}

