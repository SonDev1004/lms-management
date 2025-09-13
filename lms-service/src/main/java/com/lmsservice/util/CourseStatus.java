package com.lmsservice.util;

public enum CourseStatus {
    DRAFT(0), SCHEDULED(1), ENROLLING(2), WAITLIST(3), IN_PROGRESS(4), COMPLETED(5);
    private final int code;
    CourseStatus(int code){ this.code = code; }
    public int getCode(){ return code; }
    public static CourseStatus of(Integer code){
        if (code == null) return null;
        for (var s : values()) if (s.code == code) return s;
        throw new IllegalArgumentException("Invalid course status: " + code);
    }

    /**
     0 – DRAFT: soạn thảo, chưa công bố → ẩn FE.

     1 – SCHEDULED: đã công bố lịch, chưa mở ghi danh → FE hiển thị “Sắp mở”.

     2 – ENROLLING: mở ghi danh → FE hiển thị CTA “Đăng ký”.

     3 – WAITLIST: đã đủ chỗ, mở danh sách chờ → FE hiển thị “Chờ suất”.

     4 – IN_PROGRESS: đang học → mặc định ẩn CTA; nếu cho vào trễ, đổi CTA “Liên hệ tư vấn”.

     5 – COMPLETED: đã kết thúc → ẩn khỏi trang bán khoá.

     */
}
