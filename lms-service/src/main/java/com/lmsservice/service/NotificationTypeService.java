package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.response.OptionDto;

public interface NotificationTypeService {
    List<OptionDto> getTypeOptions();
}
