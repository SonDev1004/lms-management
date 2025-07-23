package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentHistory extends EntityAbstract {


    @Column(precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "nvarchar(255)")
    private String bankCode;

    @Column(columnDefinition = "nvarchar(255)")
    private String bankTranNo;

    @Column(columnDefinition = "nvarchar(255)")
    private String cardType;

    @Column(columnDefinition = "nvarchar(255)")
    private String orderInfo;

    @Column(columnDefinition = "nvarchar(255)")
    private String transactionNo;

    @Column(columnDefinition = "nvarchar(255)")
    private String responseCode;

    @Column(columnDefinition = "nvarchar(255)")
    private String transactionStatus;

    @Column(columnDefinition = "nvarchar(255)")
    String referenceNumber;

    @Column(columnDefinition = "nvarchar(255)")
    String paymentMethod;

    LocalDateTime paymentDate;

    @ManyToOne()
    @JoinColumn(name = "enrollmentId", nullable = false)
    Enrollment enrollment;

}
