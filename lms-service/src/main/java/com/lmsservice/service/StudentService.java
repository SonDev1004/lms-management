package com.lmsservice.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.StudentResponseDTO;
import com.lmsservice.entity.User;
import com.lmsservice.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Page<StudentResponseDTO> getAllStudents(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        return studentRepository.findAll(pageable)
                .map(student -> {
                    User user = student.getUser();
                    return StudentResponseDTO.builder()
                            .id(student.getId())
                            .code(student.getCode())
                            .level(student.getLevel())
                            .note(student.getNote())
                            .userId(user.getId())
                            .username(user.getUserName())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .dateOfBirth(user.getDateOfBirth())
                            .address(user.getAddress())
                            .gender(user.getGender())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .avatar(user.getAvatar())
                            .build();
                });
    }
}
