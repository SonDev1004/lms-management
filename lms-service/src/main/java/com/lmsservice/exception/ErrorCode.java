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
    NOTIFICATION_NOT_FOUND(1057, "Notification not found", HttpStatus.NOT_FOUND);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
