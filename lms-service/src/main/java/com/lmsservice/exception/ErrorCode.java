package com.lmsservice.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTS(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTS(1005, "User or Password not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1009, "Token has expired", HttpStatus.UNAUTHORIZED),
    UNSUPPORTED_TOKEN(1010, "Unsupported JWT token", HttpStatus.UNAUTHORIZED),
    MALFORMED_TOKEN(1011, "Malformed JWT token", HttpStatus.UNAUTHORIZED),
    INVALID_SIGNATURE(1012, "Invalid JWT signature", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1013, "Invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_BLACKLISTED(1014, "Token is blacklisted", HttpStatus.UNAUTHORIZED),
    // Program Code
    PROGRAM_NOT_FOUND(1014, "Program not found", HttpStatus.NOT_FOUND),
    INVALID_PROGRAM_RANGE(1015, "Minimum student cannot be greater than maximum student", HttpStatus.BAD_REQUEST),
    DUPLICATE_PROGRAM_TITLE(1016, "Program title already exists", HttpStatus.BAD_REQUEST),
    INVALID_MIN_STUDENT(1017, "Minimum student must be at least 1", HttpStatus.BAD_REQUEST),
    INVALID_MAX_STUDENT(1018, "Maximum student must be at least 1", HttpStatus.BAD_REQUEST),
    // Subject Code
    SUBJECT_NOT_FOUND(1019, "Subject not found", HttpStatus.NOT_FOUND),
    SUBJECT_ALREADY_EXISTS(1020, "Subject title already exists", HttpStatus.BAD_REQUEST),
    SUBJECT_INVALID_RANGE(1021, "Minimum student cannot be greater than maximum student", HttpStatus.BAD_REQUEST),
    INVALID_SUBJECT_MIN_STUDENT(1022, "Minimum student must be at least 1", HttpStatus.BAD_REQUEST),
    INVALID_SUBJECT_MAX_STUDENT(1023, "Maximum student must be at least 1", HttpStatus.BAD_REQUEST),
    INVALID_SESSION_NUMBER(1024, "Session number cannot exceed 50", HttpStatus.BAD_REQUEST),
    INVALID_SUBJECT_FEE(1025, "Fee must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    INVALID_SUBJECT_TITLE(1026, "Subject title cannot be empty", HttpStatus.BAD_REQUEST),
    INVALID_SUBJECT_TITLE_LENGTH(1027, "Subject title must be less than 100 characters", HttpStatus.BAD_REQUEST),
    INVALID_MIN_MAX_STUDENT(1028, "Student must be at least 1", HttpStatus.BAD_REQUEST),
    // Curriculum Code
    EMPTY_SUBJECT_LIST(1029, "Subject list cannot be empty", HttpStatus.BAD_REQUEST),
    PROGRAM_NOT_ACTIVE(1030, "Program is not active", HttpStatus.BAD_REQUEST),
    DUPLICATE_ORDER_NUMBER(1031, "Duplicate order number in subject list", HttpStatus.BAD_REQUEST),
    SUBJECT_ALREADY_IN_PROGRAM(1032, "Subject already exists in the program", HttpStatus.BAD_REQUEST),
    SUBJECT_NOT_ACTIVE(1033, "Subject is not active", HttpStatus.BAD_REQUEST),
    DUPLICATE_SUBJECT_IN_REQUEST(1034, "Duplicate subject in request", HttpStatus.BAD_REQUEST),
    // register
    USERNAME_ALREADY_EXISTS(1035, "Username already exists", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(1036, "Email already exists", HttpStatus.BAD_REQUEST),
    // change password
    PASSWORD_NOT_MATCH(1037, "Password and confirm password do not match", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_MATCH(1038, "Old password does not match", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_SAME_AS_OLD(1039, "New password cannot be the same as old password", HttpStatus.BAD_REQUEST),
    // user
    USER_NOT_FOUND(1040, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED_ACCESS_ROLE(1041, "Unauthorized access due to insufficient role permissions", HttpStatus.FORBIDDEN),
    // Lesson
    LESSON_NOT_FOUND(1042, "Lesson not found", HttpStatus.NOT_FOUND),
    // Assignment
    ASSIGNMENT_NOT_FOUND(1043, "Assignment not found", HttpStatus.NOT_FOUND),
    // Course
    COURSE_NOT_FOUND(1044, "Course not found", HttpStatus.NOT_FOUND),
    // Student
    STUDENT_IS_NOT_ENROLLED(1045, "Student is not enrolled", HttpStatus.NOT_FOUND),
    // Payment & Enrollment
    PENDING_NOT_FOUND(1046, "Pending enrollment not found", HttpStatus.NOT_FOUND),
    PAYMENT_HISTORY_NOT_FOUND(1047, "Payment history not found", HttpStatus.NOT_FOUND),
    ENROLLMENT_NOT_FOUND(1048, "Enrollment not found", HttpStatus.NOT_FOUND),
    PAYMENT_AMOUNT_MISMATCH(1049, "Payment amount does not match", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(1046, "Invalid request", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_FOUND(1050, "Payment not found", HttpStatus.NOT_FOUND),
    // Attendance
    SESSION_NOT_FOUND(1051, "Session not found", HttpStatus.NOT_FOUND),
    INTERNAL_ERROR(1052, "Internal error", HttpStatus.INTERNAL_SERVER_ERROR),
    STUDENT_NOT_IN_COURSE(1053, "Student not in course", HttpStatus.NOT_FOUND),
    INVALID_DATE(1054, "Invalid date", HttpStatus.BAD_REQUEST),
    // create user
    DUPLICATE_USER(1055, "User with the same username or email already exists", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1056, "Role not found", HttpStatus.NOT_FOUND),
    // Notification
    NOTIFICATION_NOT_FOUND(1057, "Notification not found", HttpStatus.NOT_FOUND),
    NOTIFICATION_TYPE_NOT_FOUND(1058, "Notification type not found", HttpStatus.NOT_FOUND),
    NO_RECEIVER_FOUND(1059, "No receiver found for the notification", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(1060, "Unauthorized access to the resource", HttpStatus.FORBIDDEN),
    MAKEUP_REQUEST_NOT_FOUND(1061, "Make-up request not found", HttpStatus.NOT_FOUND),
    MAKEUP_REQUEST_ALREADY_DONE(1062, "Make-up request has already been processed", HttpStatus.BAD_REQUEST),
    ATTENDANCE_JSON_INVALID(1063, "Attendance JSON is invalid", HttpStatus.BAD_REQUEST),
    RETAKE_ALREADY_REQUESTED(1064,"Retake already requested", HttpStatus.BAD_REQUEST),
    RETAKE_NOT_ALLOWED_ALREADY_SUBMITTED(1065, "Retake not allowed already submitted", HttpStatus.BAD_REQUEST),
    RETAKE_NOT_ALLOWED_NOT_OVERDUE(1066, "Retake not allowed not overdue", HttpStatus.BAD_REQUEST),
    RETAKE_ALREADY_HANDLED(1067, "Retake already handled", HttpStatus.BAD_REQUEST),
    RETAKE_REQUEST_NOT_FOUND(1068, "Retake request not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(1069, "Room not found", HttpStatus.NOT_FOUND),
    COURSE_NO_SESSIONS(1070, "Course has no sessions", HttpStatus.BAD_REQUEST),
    TEACHER_NOT_FOUND(1071, "Teacher not found", HttpStatus.NOT_FOUND),
    STAFF_NOT_FOUND(1072, "Staff not found", HttpStatus.NOT_FOUND),
    COURSE_NO_TIMESLOT(1073, "Course has no timeslot", HttpStatus.BAD_REQUEST),
    COURSE_START_DATE_REQUIRED(1074, "Course start date is required", HttpStatus.BAD_REQUEST),
    TEACHER_BUSY(1075, "Teacher is busy during the selected timeslot", HttpStatus.BAD_REQUEST),
    ROOM_BUSY(1076, "Room is busy during the selected timeslot", HttpStatus.BAD_REQUEST),
    COURSE_NOT_OPEN(1077, "Course is not open for enrollment", HttpStatus.BAD_REQUEST),
    COURSE_FULL(1078, "Course is full", HttpStatus.BAD_REQUEST),
    COURSE_ALREADY_STARTED(1079, "Course has already started", HttpStatus.BAD_REQUEST),
    PROGRAM_NO_SUBJECTS(1080, "Program has no subjects assigned", HttpStatus.BAD_REQUEST),
    INVALID_COURSE_FEE(1081, "Course fee must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    TRACK_CODE_DUPLICATED(1082, "Track code already exists", HttpStatus.BAD_REQUEST),
    COURSE_HAS_SESSIONS_CANNOT_CHANGE_TEACHER(1083, "Course has sessions and cannot change teacher", HttpStatus.BAD_REQUEST),
    COURSE_BASE_TITLE_REQUIRED(1084, "Course base title is required", HttpStatus.BAD_REQUEST),
    COURSE_CAPACITY_INVALID(1085, "Course capacity must be at least 1", HttpStatus.BAD_REQUEST),
    COURSE_SUBJECT_NOT_IN_PROGRAM(1086, "Course subject is not part of the program", HttpStatus.BAD_REQUEST),
    COURSE_TEACHER_REQUIRED(1087, "Course teacher is required", HttpStatus.BAD_REQUEST),
    PREVIOUS_COURSE_NOT_FOUND(1088, "Previous course not found in track", HttpStatus.NOT_FOUND),
    PREVIOUS_COURSE_NO_SESSIONS(1089, "Previous course has no sessions", HttpStatus.NOT_FOUND),
    TRACK_CODE_REQUIRED(1090, "Track code is required for courses in a track", HttpStatus.BAD_REQUEST),
    TRACK_NOT_FOUND(1091, "Track not found", HttpStatus.NOT_FOUND),
    COURSE_ID_REQUIRED(1092, "Course ID is required", HttpStatus.BAD_REQUEST),
    COURSE_SUBJECT_NOT_MATCH(1093, "Course does not belong to the specified subject", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND(1094, "Student not found", HttpStatus.NOT_FOUND);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
