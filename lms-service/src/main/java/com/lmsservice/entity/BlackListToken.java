package com.lmsservice.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlackListToken extends EntityAbstract {

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String token;
}
