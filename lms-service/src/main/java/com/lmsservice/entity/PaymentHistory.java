package com.lmsservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentHistory extends EntityAbstract {

    @Column(columnDefinition = "decimal(18,2)", nullable = false)
    private BigDecimal amount;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String bankCode;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String bankTranNo;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String cardType;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String orderInfo;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String transactionNo;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String responseCode;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String transactionStatus;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    String referenceNumber;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    String paymentMethod;

    LocalDateTime paymentDate;

    @ManyToOne()
    @JoinColumn(name = "enrollment_id", nullable = false)
    Enrollment enrollment;
}
