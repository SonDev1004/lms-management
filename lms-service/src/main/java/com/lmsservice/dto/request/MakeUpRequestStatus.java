package com.lmsservice.dto.request;

public enum MakeUpRequestStatus {
    PENDING,    // Học sinh đã gửi, chờ QLĐT xử lý
    DONE,       // Đã xác nhận học bù (và đã chỉnh attendance_list)
    REJECTED    // (optional) nếu sau này bạn muốn từ chối
}
