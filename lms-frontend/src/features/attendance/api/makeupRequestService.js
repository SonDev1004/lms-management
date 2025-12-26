// src/features/makeup/api/makeupRequestService.js
import axiosClient from "@/shared/api/axiosClient.js";
import urls from "@/shared/constants/urls.js";

/** ===================== STUDENT ===================== **/

// POST /api/student/makeup-requests/create
export async function createStudentMakeupRequest(sessionId, reason) {
    const res = await axiosClient.post(urls.studentMakeupRequestCreate, { sessionId, reason });
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// GET /api/student/makeup-requests (paging + filter)
export async function getMyMakeupRequests({ status, courseId, page = 0, size = 20 } = {}) {
    const res = await axiosClient.get(urls.studentMakeupRequests, {
        params: {
            status: status || undefined,
            courseId: courseId || undefined,
            page,
            size,
        },
    });
    const api = res.data || {};
    return api.result ?? api.data ?? { content: [], totalElements: 0, number: page, size };
}

// GET /api/student/makeup-requests/{id}
export async function getMyMakeupRequestDetail(id) {
    const res = await axiosClient.get(urls.studentMakeupRequestDetail(id));
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// GET /available-sessions?missedSessionId=
export async function getAvailableMakeupSessionsForStudent(missedSessionId) {
    const res = await axiosClient.get(urls.studentMakeupAvailableSessions, {
        params: { missedSessionId },
    });
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

// POST /{id}/select-preferred-session?preferredSessionId=
export async function selectPreferredMakeupSession(requestId, preferredSessionId) {
    const res = await axiosClient.post(
        urls.studentMakeupSelectPreferredSession(requestId, preferredSessionId)
    );
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// Sessions of a course for student
export async function getSessionsOfCourseForStudent(courseId) {
    const res = await axiosClient.get(urls.studentCourseSessions(courseId));
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

/** ===================== ADMIN / AM ===================== **/

// GET /api/admin/makeup-requests (paging + filter)
export async function fetchAdminMakeupRequests({ status, courseId, page = 0, size = 20 } = {}) {
    const res = await axiosClient.get(urls.adminMakeupRequests, {
        params: {
            status: status || undefined,
            courseId: courseId || undefined,
            page,
            size,
        },
    });
    const api = res.data || {};
    return api.result ?? api.data ?? { content: [], totalElements: 0, number: page, size };
}

// GET /api/admin/makeup-requests/{id}
export async function getAdminMakeupRequestDetail(id) {
    const res = await axiosClient.get(urls.adminMakeupRequestDetail(id));
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// GET /api/admin/makeup-requests/{id}/available-sessions
export async function getAvailableMakeupSessionsForAdminRequest(requestId) {
    const res = await axiosClient.get(urls.adminMakeupAvailableSessionsForRequest(requestId));
    const api = res.data || {};
    return api.result ?? api.data ?? [];
}

// POST /api/admin/makeup-requests/{id}/approve
export async function approveMakeupRequest(id, { makeupSessionId, adminNote }) {
    const res = await axiosClient.post(urls.adminApproveMakeupRequest(id), {
        makeupSessionId,
        adminNote,
    });
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// POST /api/admin/makeup-requests/{id}/reject
export async function rejectMakeupRequest(id, { adminNote }) {
    const res = await axiosClient.post(urls.adminRejectMakeupRequest(id), { adminNote });
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}

// POST /api/admin/makeup-requests/{id}/mark-attended
export async function markMakeupRequestAttended(id, note) {
    const res = await axiosClient.post(urls.adminMarkMakeupAttended(id), { note });
    const api = res.data || {};
    return api.result ?? api.data ?? api;
}
