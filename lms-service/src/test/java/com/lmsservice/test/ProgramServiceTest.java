package com.lmsservice.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.entity.Curriculum;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CurriculumRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.service.impl.ProgramServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProgramServiceTest {

    @Mock
    private ProgramRepository programRepository;

    @Mock
    private CurriculumRepository curriculumRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private ProgramServiceImpl programService;

    private ProgramRequest request;
    private Program program;
    private Subject subject;

    @BeforeEach
    void setUp() {
        request = ProgramRequest.builder()
                .title("English Beginner")
                .minStudent(5)
                .maxStudent(20)
                .fee(BigDecimal.valueOf(200))
                .description("Basic English course")
                .isActive(true)
                .build();

        program = new Program();
        program.setId(1L);
        program.setIsActive(true);

        subject = new Subject();
        subject.setId(10L);
        subject.setIsActive(true);
    }

    // ----------------- TEST CREATE PROGRAM -----------------

    @Test
    @DisplayName("Create program successfully")
    void createProgram_Success() {
        Program savedProgram = new Program();
        savedProgram.setId(1L);
        savedProgram.setTitle(request.getTitle());
        savedProgram.setMinStudent(request.getMinStudent());
        savedProgram.setMaxStudent(request.getMaxStudent());
        savedProgram.setFee(request.getFee());
        savedProgram.setIsActive(request.getIsActive());
        savedProgram.setCode("PROG-20250801-12345678");

        when(programRepository.existsByTitle(request.getTitle())).thenReturn(false);
        when(programRepository.save(any(Program.class))).thenReturn(savedProgram);

        ProgramResponse response = programService.createProgram(request);

        assertNotNull(response);
        assertEquals(request.getTitle(), response.getTitle());
        assertTrue(response.getIsActive());
        verify(programRepository).save(any(Program.class));
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
    }

    @Test
    @DisplayName("Throw exception when maxStudent < 1")
    void createProgram_MaxStudentLessThanOne_ShouldThrowException() {
        request.setMaxStudent(0);

        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        assertEquals(ErrorCode.INVALID_MAX_STUDENT, exception.getErrorCode());
    }

    @Test
    @DisplayName("Throw exception when program title already exists")
    void createProgram_DuplicateTitle_ShouldThrowException() {
        when(programRepository.existsByTitle(request.getTitle())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> programService.createProgram(request));

        assertEquals(ErrorCode.DUPLICATE_PROGRAM_TITLE, exception.getErrorCode());
        verify(programRepository, never()).save(any(Program.class));
    }

    // ----------------- TEST ADD SUBJECTS -----------------

    @Test
    @DisplayName("Add subject successfully")
    void addSubjectsToProgram_Success() {
        List<CurriculumRequest> requests =
                List.of(CurriculumRequest.builder().subjectId(10L).build());

        when(programRepository.findById(1L)).thenReturn(Optional.of(program));
        when(subjectRepository.findById(10L)).thenReturn(Optional.of(subject));
        when(curriculumRepository.findMaxOrderNumberByProgramId(1L)).thenReturn(3);

        Curriculum curriculum = new Curriculum();
        curriculum.setId(100L);
        curriculum.setOrderNumber(4); // nextOrder = 3 + 1
        curriculum.setProgram(program);
        curriculum.setSubject(subject);

        when(curriculumRepository.saveAll(anyList())).thenReturn(List.of(curriculum));

        List<CurriculumResponse> responses = programService.addSubjectsToProgram(1L, requests);

        assertEquals(1, responses.size());
        assertEquals(100L, responses.get(0).getId());
        assertEquals(4, responses.get(0).getOrder());
        verify(curriculumRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("Throw exception when request list is empty")
    void addSubjectsToProgram_EmptyRequest_ThrowsException() {
        AppException exception = assertThrows(
                AppException.class, () -> programService.addSubjectsToProgram(1L, Collections.emptyList()));

        assertEquals(ErrorCode.EMPTY_SUBJECT_LIST, exception.getErrorCode());
        verifyNoInteractions(programRepository);
    }

    @Test
    @DisplayName("Throw exception when program is not found")
    void addSubjectsToProgram_ProgramNotFound_ThrowsException() {
        when(programRepository.findById(1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(
                AppException.class,
                () -> programService.addSubjectsToProgram(
                        1L, List.of(CurriculumRequest.builder().subjectId(10L).build())));

        assertEquals(ErrorCode.PROGRAM_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    @DisplayName("Throw exception when program is inactive")
    void addSubjectsToProgram_ProgramNotActive_ThrowsException() {
        program.setIsActive(false);
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));

        AppException exception = assertThrows(
                AppException.class,
                () -> programService.addSubjectsToProgram(
                        1L, List.of(CurriculumRequest.builder().subjectId(10L).build())));

        assertEquals(ErrorCode.PROGRAM_NOT_ACTIVE, exception.getErrorCode());
    }

    @Test
    @DisplayName("Throw exception when duplicate subjectId in request")
    void addSubjectsToProgram_DuplicateSubjectInRequest_ThrowsException() {
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));

        List<CurriculumRequest> requests = List.of(
                CurriculumRequest.builder().subjectId(10L).build(),
                CurriculumRequest.builder().subjectId(10L).build());

        AppException exception =
                assertThrows(AppException.class, () -> programService.addSubjectsToProgram(1L, requests));

        assertEquals(ErrorCode.DUPLICATE_SUBJECT_IN_REQUEST, exception.getErrorCode());
    }

    @Test
    @DisplayName("Throw exception when subject not found")
    void addSubjectsToProgram_SubjectNotFound_ThrowsException() {
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));
        when(subjectRepository.findById(10L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(
                AppException.class,
                () -> programService.addSubjectsToProgram(
                        1L, List.of(CurriculumRequest.builder().subjectId(10L).build())));

        assertEquals(ErrorCode.SUBJECT_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    @DisplayName("Throw exception when subject is inactive")
    void addSubjectsToProgram_SubjectInactive_ThrowsException() {
        subject.setIsActive(false);
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));
        when(subjectRepository.findById(10L)).thenReturn(Optional.of(subject));

        AppException exception = assertThrows(
                AppException.class,
                () -> programService.addSubjectsToProgram(
                        1L, List.of(CurriculumRequest.builder().subjectId(10L).build())));

        assertEquals(ErrorCode.SUBJECT_NOT_ACTIVE, exception.getErrorCode());
    }
}
