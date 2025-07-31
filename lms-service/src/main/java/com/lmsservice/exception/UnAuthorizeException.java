package com.lmsservice.exception;

import lombok.Getter;

@Getter
public class UnAuthorizeException extends RuntimeException {
    private final ErrorCode errorCode; /* Biến có kiểu enum */

    public UnAuthorizeException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
