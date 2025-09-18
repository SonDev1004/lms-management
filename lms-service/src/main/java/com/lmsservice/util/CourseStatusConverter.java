package com.lmsservice.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true) // Tự áp dụng cho mọi field kiểu CourseStatus
public class CourseStatusConverter implements AttributeConverter<CourseStatus, Integer> {
    @Override
    public Integer convertToDatabaseColumn(CourseStatus status) {
        return status == null ? null : status.getCode();
    }

    @Override
    public CourseStatus convertToEntityAttribute(Integer code) {
        return CourseStatus.of(code);
    }
}
