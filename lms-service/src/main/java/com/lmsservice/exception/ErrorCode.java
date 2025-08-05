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
    USER_NOT_EXISTS(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1009, "Token has expired", HttpStatus.UNAUTHORIZED),
    UNSUPPORTED_TOKEN(1010, "Unsupported JWT token", HttpStatus.UNAUTHORIZED),
    MALFORMED_TOKEN(1011, "Malformed JWT token", HttpStatus.UNAUTHORIZED),
    INVALID_SIGNATURE(1012, "Invalid JWT signature", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1013, "Invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_BLACKLISTED(1014, "Token is blacklisted", HttpStatus.UNAUTHORIZED);
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
    INVALID_MIN_MAX_STUDENT(1028, "Student must be at least 1", HttpStatus.BAD_REQUEST);


    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
