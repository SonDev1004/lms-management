package com.lmsservice.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.lmsservice.dto.request.CreateCoursesByProgramRequest;
import com.lmsservice.dto.response.CourseListItemDTO;
import com.lmsservice.dto.response.CreateCoursesByProgramResponse;
import com.lmsservice.dto.response.OptionDto;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.entity.*;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.*;
import com.lmsservice.service.CourseService;
import com.lmsservice.util.CourseStatus;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    SessionRepository sessionRepository;
    CourseRepository courseRepository;
    ProgramRepository programRepository;
    SubjectRepository subjectRepository;
    TeacherRepository teacherRepository;
    StaffRepository staffRepository;
    CourseStudentRepository courseStudentRepository;
    CurriculumRepository curriculumRepository;
    RoomRepository roomRepository;

    static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
    static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");


    private void refreshEnrollmentStatusForMvp(List<Course> courses) {
        if (courses == null || courses.isEmpty()) return;

        LocalDate today = LocalDate.now();
        List<Course> changed = new ArrayList<>();

        for (Course c : courses) {
            CourseStatus oldStatus = c.getStatus();
            CourseStatus newStatus = oldStatus;

            // 1. MỞ ĐĂNG KÝ
            if (c.getStartDate() != null
                    && (oldStatus == CourseStatus.DRAFT || oldStatus == CourseStatus.SCHEDULED)
                    && !today.isBefore(c.getStartDate())) {
                newStatus = CourseStatus.ENROLLING;
            }

            // 2. ĐÓNG ĐĂNG KÝ → ĐANG HỌC (sau buổi #3)
            LocalDate thirdDate = sessionRepository
                    .findDateByCourseIdAndOrderSession(c.getId(), (short) 3)
                    .orElse(null);

            if (thirdDate != null && today.isAfter(thirdDate)) {
                newStatus = CourseStatus.IN_PROGRESS;
            }

            // 3. HOÀN THÀNH
            LocalDate lastDate = sessionRepository
                    .findMaxDateByCourseId(c.getId())
                    .orElse(null);

            if (lastDate != null && today.isAfter(lastDate)) {
                newStatus = CourseStatus.COMPLETED;
            }

            if (newStatus != oldStatus) {
                c.setStatus(newStatus);
                changed.add(c);
            }
        }

        if (!changed.isEmpty()) {
            courseRepository.saveAll(changed);
        }
    }

    @Override
    @Transactional
    public void refreshCourseStatusesMvp() {
        LocalDate today = LocalDate.now();

        List<CourseStatus> candidates = List.of(
                CourseStatus.DRAFT,
                CourseStatus.SCHEDULED,
                CourseStatus.ENROLLING,
                CourseStatus.WAITLIST,
                CourseStatus.IN_PROGRESS
        );

        List<Course> courses = courseRepository.findByStatusIn(candidates);
        if (courses == null || courses.isEmpty()) return;

        List<Course> changed = new ArrayList<>();

        for (Course c : courses) {
            if (c == null) continue;

            CourseStatus oldStatus = c.getStatus();
            CourseStatus newStatus = oldStatus;

            // 1) OPEN REG: today >= startDate, từ DRAFT/SCHEDULED -> ENROLLING
            if (c.getStartDate() != null
                    && (oldStatus == CourseStatus.DRAFT || oldStatus == CourseStatus.SCHEDULED)
                    && !today.isBefore(c.getStartDate())) {
                newStatus = CourseStatus.ENROLLING;
            }

            // 2) CLOSE REG: today > session#3.date => IN_PROGRESS
            if (oldStatus == CourseStatus.ENROLLING
                    || oldStatus == CourseStatus.WAITLIST
                    || oldStatus == CourseStatus.SCHEDULED) {

                LocalDate thirdDate = sessionRepository
                        .findDateByCourseIdAndOrderSession(c.getId(), (short) 3)
                        .orElse(null);

                if (thirdDate != null && today.isAfter(thirdDate)) {
                    newStatus = CourseStatus.IN_PROGRESS;
                }
            }

            // 3) FINISH: today > last session => COMPLETED
            if (newStatus == CourseStatus.IN_PROGRESS) {
                LocalDate lastDate = sessionRepository.findMaxDateByCourseId(c.getId()).orElse(null);
                if (lastDate != null && today.isAfter(lastDate)) {
                    newStatus = CourseStatus.COMPLETED;
                }
            }

            if (newStatus != oldStatus) {
                c.setStatus(newStatus);
                changed.add(c);
            }
        }

        if (!changed.isEmpty()) {
            courseRepository.saveAll(changed);
        }
    }

    @Override
    public List<SessionInfoDTO> getSessions(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        long studentCount = courseStudentRepository.countByCourseId(courseId);

        List<Session> sessions = sessionRepository.findByCourseIdOrderByOrderSessionAsc(courseId);

        return sessions.stream()
                .map(s -> SessionInfoDTO.builder()
                        .id(s.getId())
                        .order(s.getOrderSession())
                        .date(s.getDate() != null ? s.getDate().format(DATE_FMT) : null)
                        .starttime(s.getStartTime() != null ? s.getStartTime().format(TIME_FMT) : null)
                        .endtime(s.getEndTime() != null ? s.getEndTime().format(TIME_FMT) : null)
                        .room(s.getRoom() != null ? s.getRoom().getName() : null)
                        .status(s.getStatus())
                        .studentCount(studentCount) // NEW
                        .build())
                .toList();
    }


    @Override
    @Transactional
    public CreateCoursesByProgramResponse createCoursesByProgram(CreateCoursesByProgramRequest req) {

        if (req == null) throw new AppException(ErrorCode.INVALID_REQUEST);
        if (req.getProgramId() == null) throw new AppException(ErrorCode.PROGRAM_NOT_FOUND);
        if (req.getStaffId() == null) throw new AppException(ErrorCode.STAFF_NOT_FOUND);

        String baseTitle = Optional.ofNullable(req.getBaseTitle()).orElse("").trim();
        if (baseTitle.isBlank()) throw new AppException(ErrorCode.COURSE_BASE_TITLE_REQUIRED);

        LocalDate start = req.getFirstWeekStart();
        if (start == null) throw new AppException(ErrorCode.COURSE_START_DATE_REQUIRED);

        Integer capacity = req.getCapacity() != null ? req.getCapacity() : 20;
        if (capacity < 1) throw new AppException(ErrorCode.COURSE_CAPACITY_INVALID);

        Program program = programRepository.findById(req.getProgramId())
                .orElseThrow(() -> new AppException(ErrorCode.PROGRAM_NOT_FOUND));

        Staff staff = staffRepository.findById(req.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        // curriculum subjects
        List<Curriculum> curr = curriculumRepository.findByProgram_IdOrderByOrderNumberAsc(program.getId());
        if (curr == null || curr.isEmpty()) {
            throw new AppException(ErrorCode.PROGRAM_NO_SUBJECTS);
        }

        // Map subjectId -> Curriculum (để lấy orderNumber + subject luôn)
        Map<Long, Curriculum> curriculumBySubjectId = curr.stream()
                .collect(Collectors.toMap(
                        c -> c.getSubject().getId(),
                        c -> c,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));

        Set<Long> allowedSubjectIds = curriculumBySubjectId.keySet();

        List<Long> targetSubjectIds;
        if (req.getSubjectIds() == null || req.getSubjectIds().isEmpty()) {
            // theo đúng thứ tự curriculum
            targetSubjectIds = new ArrayList<>(allowedSubjectIds);
        } else {
            for (Long sid : req.getSubjectIds()) {
                if (sid == null || !allowedSubjectIds.contains(sid)) {
                    throw new AppException(ErrorCode.COURSE_SUBJECT_NOT_IN_PROGRAM);
                }
            }
            // keep curriculum order
            targetSubjectIds = curriculumBySubjectId.keySet().stream()
                    .filter(req.getSubjectIds()::contains)
                    .toList();
        }

        // trackCode
        String trackCode;
        if (req.getTrackCode() != null && !req.getTrackCode().trim().isBlank()) {
            trackCode = req.getTrackCode().trim();
            if (courseRepository.existsByTrackCode(trackCode)) {
                throw new AppException(ErrorCode.TRACK_CODE_DUPLICATED);
            }
        } else {
            String generated;
            do {
                generated = generateTrackCode(program, start);
            } while (courseRepository.existsByTrackCode(generated));
            trackCode = generated;
        }

        List<Course> toSave = new ArrayList<>();

        for (Long subjectId : targetSubjectIds) {
            Curriculum cu = curriculumBySubjectId.get(subjectId);
            if (cu == null) throw new AppException(ErrorCode.COURSE_SUBJECT_NOT_IN_PROGRAM);

            Subject subject = cu.getSubject();

            if (subject == null) throw new AppException(ErrorCode.SUBJECT_NOT_FOUND);
            if (Boolean.FALSE.equals(subject.getIsActive())) throw new AppException(ErrorCode.SUBJECT_NOT_ACTIVE);

            Integer orderNumber = cu.getOrderNumber();
            if (orderNumber == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            Course course = new Course();
            course.setProgram(program);
            course.setSubject(subject);

            // teacher gán sau
            course.setTeacher(null);

            course.setStaff(staff);
            course.setCapacity(capacity);
            course.setPlannedSession(subject.getSessionNumber());
            course.setStatus(CourseStatus.DRAFT);
            course.setCurriculumOrder(orderNumber);
            if (orderNumber == 1) {
                course.setStartDate(start);
            } else {
                course.setStartDate(null);
            }
            course.setTitle(baseTitle + " – " + subject.getTitle());

            String code;
            do {
                code = generateCourseCode();
            } while (courseRepository.existsByCode(code));
            course.setCode(code);

            course.setTrackCode(trackCode);

            toSave.add(course);
        }

        List<Course> saved = courseRepository.saveAll(toSave);

        return CreateCoursesByProgramResponse.builder()
                .trackCode(trackCode)
                .createdCourseIds(saved.stream().map(Course::getId).toList())
                .build();
    }

    @Override
    @Transactional
    public void assignTeacher(Long courseId, Long teacherId) {
        if (courseId == null) throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        if (teacherId == null) throw new AppException(ErrorCode.TEACHER_NOT_FOUND);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

        long sessionCount = sessionRepository.countByCourseId(courseId);
        if (sessionCount > 0) {
            throw new AppException(ErrorCode.COURSE_HAS_SESSIONS_CANNOT_CHANGE_TEACHER);
        }

        course.setTeacher(teacher);
        courseRepository.save(course);
    }

    @Override
    public void publishCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        if (course.getTeacher() == null) {
            throw new AppException(ErrorCode.COURSE_TEACHER_REQUIRED);
        }

        if (course.getSessions() == null || course.getSessions().isEmpty()) {
            throw new AppException(ErrorCode.COURSE_NO_SESSIONS);
        }

        course.setStatus(CourseStatus.SCHEDULED);
        courseRepository.save(course);
    }

    @Override
    @Transactional
    public List<CourseListItemDTO> getAllCourses() {
        refreshCourseStatusesMvp();
        List<Course> courses = courseRepository.findAll();

        // NEW: auto refresh status theo MVP trước khi map ra DTO
        refreshEnrollmentStatusForMvp(courses);

        return courses.stream().map(c -> {
            CourseListItemDTO dto = new CourseListItemDTO();
            dto.setCourseId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setCode(c.getCode());

            dto.setTeacherName(
                    c.getTeacher() != null && c.getTeacher().getUser() != null
                            ? c.getTeacher().getUser().getFirstName() + " " + c.getTeacher().getUser().getLastName()
                            : null
            );
            dto.setProgramName(c.getProgram() != null ? c.getProgram().getTitle() : null);
            dto.setSubjectName(c.getSubject() != null ? c.getSubject().getTitle() : null);

            dto.setCapacity(c.getCapacity());
            dto.setStudents(courseStudentRepository.countByCourseId(c.getId()));
            dto.setSessions(sessionRepository.countByCourseId(c.getId()));

            dto.setStartDate(c.getStartDate() != null ? c.getStartDate().toString() : null);
            dto.setStatus(c.getStatus() != null ? c.getStatus().name() : null);

            return dto;
        }).toList();
    }


    @Override
    public List<OptionDto> getRoomOptionsForCourse() {
        return roomRepository.findAllByOrderByNameAsc()
                .stream()
                .map(r -> new OptionDto(r.getId().intValue(), r.getName()))
                .toList();
    }

    private String generateCourseCode() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // yyyyMMdd
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "COURSE-" + datePart + "-" + randomPart;
    }

    private String generateTrackCode(Program program, LocalDate startDate) {
        // NOTE: program.getCode() của bạn đang "PROG-yyyMMdd-xxxx"
        // Nếu muốn IELTS-2025-A => nên có field program.shortCode
        String programCode = program.getCode();

        int year = (startDate != null ? startDate.getYear() : LocalDate.now().getYear());
        String prefix = programCode + "-" + year + "-";

        List<String> existing = courseRepository.findTrackCodesByProgramAndPrefix(program.getId(), prefix);

        char next = 'A';
        for (String tc : existing) {
            if (tc == null || !tc.startsWith(prefix) || tc.length() < prefix.length() + 1) continue;
            char ch = tc.charAt(prefix.length());
            if (ch >= 'A' && ch <= 'Z' && ch >= next) next = (char) (ch + 1);
        }
        return prefix + next;
    }
}
