package com.lmsservice.util;

import lombok.Getter;

@Getter
public enum CourseStudentStatus {
    PENDING(0, "Chờ duyệt"),
    ENROLLED(1, "Đã ghi danh"),
    WAITLIST(2, "Danh sách chờ"),
    IN_PROGRESS(3, "Đang học"),
    COMPLETED(4, "Hoàn thành"),
    DROPPED(5, "Nghỉ luôn"),
    AUDIT(6, "Thính giảng");

    private final int code;
    private final String display;

    CourseStudentStatus(int code, String display) {
        this.code = code;
        this.display = display;
    }

    public static CourseStudentStatus fromCode(Integer code) {
        if (code == null) return null;
        for (var s : values()) if (s.code == code) return s;
        return null;
    }
}
