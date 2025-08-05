package com.lmsservice.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.response.SubjectResponse;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.service.impl.SubjectServiceImpl;

class SubjectServiceImplTest {

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private SubjectServiceImpl subjectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private CreateSubjectRequest buildValidRequest() {
        return CreateSubjectRequest.builder()
                .title("Java Programming")
                .minStudent(5)
                .maxStudent(20)
                .sessionNumber(10)
                .fee(BigDecimal.valueOf(500))
                .description("Java course")
                .isActive(true)
                .build();
    }

    @Test
    void createSubject_Success() {
        CreateSubjectRequest request = buildValidRequest();

        Subject savedSubject = new Subject();
        savedSubject.setId(1L);
        savedSubject.setTitle(request.getTitle());
        savedSubject.setCode("SUB-20230801-XXXX");

        when(subjectRepository.existsByTitle(request.getTitle())).thenReturn(false);
        when(subjectRepository.save(any(Subject.class))).thenReturn(savedSubject);

        SubjectResponse response = subjectService.createSubject(request);

        assertNotNull(response);
        assertEquals("Java Programming", response.getTitle());
        assertEquals(1L, response.getId());
        verify(subjectRepository, times(1)).save(any(Subject.class));
    }

    @Test
    void createSubject_TitleIsNull_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setTitle("   ");

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.INVALID_SUBJECT_TITLE, ex.getErrorCode());
    }

    @Test
    void createSubject_TitleAlreadyExists_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();

        when(subjectRepository.existsByTitle(request.getTitle())).thenReturn(true);

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.SUBJECT_ALREADY_EXISTS, ex.getErrorCode());
    }

    @Test
    void createSubject_TitleTooLong_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setTitle("A".repeat(101));

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.INVALID_SUBJECT_TITLE_LENGTH, ex.getErrorCode());
    }

    @Test
    void createSubject_MinGreaterThanMax_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setMinStudent(30);
        request.setMaxStudent(20);

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.SUBJECT_INVALID_RANGE, ex.getErrorCode());
    }

    @Test
    void createSubject_MinOrMaxStudentZero_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setMinStudent(0);

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.INVALID_MIN_MAX_STUDENT, ex.getErrorCode());
    }

    @Test
    void createSubject_SessionNumberTooHigh_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setSessionNumber(100);

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.INVALID_SESSION_NUMBER, ex.getErrorCode());
    }

    @Test
    void createSubject_FeeNegative_ShouldThrowException() {
        CreateSubjectRequest request = buildValidRequest();
        request.setFee(BigDecimal.valueOf(-100));

        AppException ex = assertThrows(AppException.class, () -> subjectService.createSubject(request));
        assertEquals(ErrorCode.INVALID_SUBJECT_FEE, ex.getErrorCode());
    }
}
