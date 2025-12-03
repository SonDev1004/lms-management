import axiosClient from "@/shared/api/axiosClient.js";

import urls from "@/shared/constants/urls.js";


export async function createStudentMakeupRequest(sessionId, reason) {
    const res = await axiosClient.post(urls.studentMakeupRequests, {
        sessionId,
        reason,
    });
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// ACADEMIC_MANAGER – lấy danh sách yêu cầu học bù 
export async function fetchAdminMakeupRequests({status, courseId, page = 0, size = 20}) {
    const res= await axiosClient.get(urls.adminMakeupRequests, {
        params: {
            status: status || undefined,
            courseId: courseId || undefined,
            page,
            size,
        },
    });
    const api = res.data || {};
    return api.result ?? api.data ?? { content: [], totalElements: 0 };
}

export async function getMyMakeupRequests() {
    const res = await axiosClient.get(urls.studentMakeupRequests);
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

export async function getSessionsOfCourseForStudent(courseId) {
    const res = await axiosClient.get(urls.studentCourseSessions(courseId));
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

export async function getSessionsForCourse(courseId) {
    const res = await axiosClient.get(urls.studentCourseSessions(courseId));
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

// ACADEMIC_MANAGER – xác nhận đã học bù
export async function markMakeupRequestAttended(id, note) {
    const res = await axiosClient.post(
        urls.adminMarkMakeupAttended(id),
        { note }
    );
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

