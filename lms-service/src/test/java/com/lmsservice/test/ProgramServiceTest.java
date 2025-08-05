package com.lmsservice.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.entity.Program;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.service.ProgramService;

@ExtendWith(MockitoExtension.class) // Kích hoạt Mockito cho JUnit 5
class ProgramServiceTest {

    @Mock
    private ProgramRepository programRepository;

    @InjectMocks
    private ProgramService programService;

    private ProgramRequest request;

    @BeforeEach
    void init() {
        // Chuẩn bị dữ liệu mặc định
        request = ProgramRequest.builder()
                .title("English Beginner")
                .minStudent(5)
                .maxStudent(20)
                .fee(BigDecimal.valueOf(200))
                .description("Basic English course")
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Create program successfully")
    void createProgram_Success() {
        // Arrange
        Program savedProgram = new Program();
        savedProgram.setId(1L);
        savedProgram.setTitle(request.getTitle());
        savedProgram.setMinStudent(request.getMinStudent());
        savedProgram.setMaxStudent(request.getMaxStudent());
        savedProgram.setFee(request.getFee());
        savedProgram.setIsActive(request.getIsActive());
        savedProgram.setCode("PROG-20250801-12345678");

        when(programRepository.save(any(Program.class))).thenReturn(savedProgram);

        // Act
        ProgramResponse response = programService.createProgram(request);

        // Assert
        assertNotNull(response);
        assertEquals(request.getTitle(), response.getTitle());
        assertEquals(request.getMinStudent(), response.getMinStudent());
        assertEquals(request.getMaxStudent(), response.getMaxStudent());
        assertEquals(request.getFee(), response.getFee());
        assertTrue(response.getIsActive());
        verify(programRepository, times(1)).save(any(Program.class));
    }

    @Test
    @DisplayName("Throw exception when minStudent > maxStudent")
    void createProgram_InvalidRange_ShouldThrowException() {
        request.setMinStudent(30);
        request.setMaxStudent(20);

        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        assertEquals(ErrorCode.INVALID_PROGRAM_RANGE, exception.getErrorCode());
        verify(programRepository, never()).save(any(Program.class));
    }

    @Test
    @DisplayName("Throw exception when minStudent < 1")
    void createProgram_MinStudentLessThanOne_ShouldThrowException() {
        request.setMinStudent(0);

        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        assertEquals(ErrorCode.INVALID_MIN_STUDENT, exception.getErrorCode());
        verify(programRepository, never()).save(any(Program.class));
    }

    @Test
    @DisplayName("Throw exception when maxStudent < 1")
    void createProgram_MaxStudentLessThanOne_ShouldThrowException() {
        request.setMaxStudent(0);

        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        assertEquals(ErrorCode.INVALID_MAX_STUDENT, exception.getErrorCode());
        verify(programRepository, never()).save(any(Program.class));
    }

    @Test
    @DisplayName("Throw exception when program title already exists")
    void createProgram_DuplicateTitle_ShouldThrowException() {
        // Arrange
        when(programRepository.existsByTitle(request.getTitle())).thenReturn(true);

        // Act
        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        // Assert
        assertEquals(ErrorCode.DUPLICATE_PROGRAM_TITLE, exception.getErrorCode());
        verify(programRepository, never()).save(any(Program.class));
    }
}
