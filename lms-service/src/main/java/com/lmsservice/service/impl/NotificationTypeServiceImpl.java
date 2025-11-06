package com.lmsservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.OptionDto;
import com.lmsservice.repository.NotificationTypeRepository;
import com.lmsservice.service.NotificationTypeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationTypeServiceImpl implements NotificationTypeService {
    NotificationTypeRepository notificationTypeRepository;

    @Override
    public List<OptionDto> getTypeOptions() {
        return notificationTypeRepository.findAll().stream()
                .map(nt -> new OptionDto(nt.getId().intValue(), nt.getTitle()))
                .toList();
    }
}
