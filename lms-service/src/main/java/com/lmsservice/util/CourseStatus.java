package com.lmsservice.util;

public enum CourseStatus {
    DRAFT(0),
    SCHEDULED(1),
    ENROLLING(2),
    WAITLIST(3),
    IN_PROGRESS(4),
    COMPLETED(5);
    private final int code;

    CourseStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static CourseStatus of(Integer code) {
        if (code == null) return null;
        for (var s : values()) if (s.code == code) return s;
        throw new IllegalArgumentException("Invalid course status: " + code);
    }

    /**
     * Text hiển thị cho STUDENT (frontend tuyển sinh)
     */
    public String getStudentText() {
        return switch (this) {
            case DRAFT, SCHEDULED -> "Sắp khai giảng";
            case ENROLLING -> "Đăng ký";
            case WAITLIST -> "Chờ suất";
            case IN_PROGRESS -> "Đang học";
            case COMPLETED -> "Đã học";
        };
    }

    /**
     * Text hiển thị cho TEACHER (quản lý lớp dạy)
     */
    public String getTeacherText() {
        return switch (this) {
            case DRAFT, SCHEDULED -> "Chưa bắt đầu";
            case ENROLLING -> "Đang tuyển sinh";
            case WAITLIST -> "Đang chờ học viên";
            case IN_PROGRESS -> "Đang giảng dạy";
            case COMPLETED -> "Đã kết thúc";
        };
    }
}
/**
 * 0 – DRAFT: soạn thảo, chưa công bố → ẩn FE.
 * <p>
 * 1 – SCHEDULED: đã công bố lịch, chưa mở ghi danh → FE hiển thị “Sắp mở”.
 * <p>
 * 2 – ENROLLING: mở ghi danh → FE hiển thị CTA “Đăng ký”.
 * <p>
 * 3 – WAITLIST: đã đủ chỗ, mở danh sách chờ → FE hiển thị “Chờ suất”.
 * <p>
 * 4 – IN_PROGRESS: đang học → mặc định ẩn CTA; nếu cho vào trễ, đổi CTA “Liên hệ tư vấn”.
 * <p>
 * 5 – COMPLETED: đã kết thúc → ẩn khỏi trang bán khoá.
 *
 */
