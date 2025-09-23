package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionInfoDTO {
    Long id;
    Short order;
    String date;
    String starttime;
    String endtime;
    String room;
    String description;
    boolean isabsent;
    Integer status;
}
