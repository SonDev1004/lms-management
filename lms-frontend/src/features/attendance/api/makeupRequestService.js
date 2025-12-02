import axiosClient from "@/shared/api/axiosClient.js";

import urls from "@/shared/constants/urls.js";

export function createStudentMakeupRequest(sessionId, reason) {
    return axiosClient.post(urls.studentCreateMakeupRequest, {
        sessionId,
        reason,
    });
}

// ACADEMIC_MANAGER – lấy danh sách yêu cầu học bù 
export function fetchAdminMakeupRequests({status, courseId, page = 0, size = 20}) {
    return axiosClient.get(urls.adminMakeupRequests, {
        params: {
            status: status || undefined,
            courseId: courseId || undefined,
            page,
            size,
        },
    });
}

// ACADEMIC_MANAGER – xác nhận đã học bù
export function markMakeupRequestAttended(id, note) {
    return axiosClient.post(urls.adminMarkMakeupAttended(id), {
        note,
    });
}
