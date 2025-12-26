import axiosClient from "@/shared/api/axiosClient";
import urls from "@/shared/constants/urls";

/**
 * Helper: lấy data chuẩn từ axiosClient (dù nó trả response hay data)
 */
function unwrap(res) {
    if (res && res.result !== undefined) return res; // axiosClient trả ApiResponse
    if (res && res.data) return res.data;            // axios gốc
    return res || {};
}

/**
 * Danh sách tất cả course cho Admin
 */
export async function fetchAllCourses() {
    const res = await axiosClient.get(urls.getAllCourses);
    const data = unwrap(res);
    return data.result ?? [];
}

/**
 * Preview sessions cho course (KHÔNG lưu DB)
 */
export async function previewSessionsForCourse(courseId, payload = {}) {
    const res = await axiosClient.post(urls.adminCoursePreviewSessions(courseId), payload);
    const data = unwrap(res);
    return data.result ?? [];
}

/**
 * Lấy danh sách session của 1 course
 */
export async function fetchSessionsByCourse(courseId) {
    const res = await axiosClient.get(urls.adminCourseSessions(courseId));
    const data = unwrap(res);
    return data.result ?? [];
}

/**
 * Generate sessions cho course
 */
export async function generateSessionsForCourse(courseId, payload = {}) {
    return axiosClient.post(urls.adminCourseGenerateSessions(courseId), payload);
}

/**
 * Publish course
 */
export async function publishCourse(courseId) {
    return axiosClient.post(urls.adminCoursePublish(courseId));
}

/**
 * Thay thế toàn bộ timeslot cho 1 course
 */
export async function replaceTimeslots(courseId, timeslots) {
    return axiosClient.put(urls.adminCourseTimeslots(courseId), timeslots);
}

/**
 * Thêm học sinh vào lớp thủ công
 */
export async function addStudentToCourse(courseId, {studentId, source = "MANUAL"}) {
    return axiosClient.post(urls.adminCourseAddStudent(courseId), {
        studentId,
        source,
    });
}

/**
 * Tạo Course (DRAFT)
 */
export async function createCoursesByProgram(payload) {
    const res = await axiosClient.post(urls.createCourse, payload);
    const data = unwrap(res);
    return data.result;
}

/**
 * Tìm Program cho form tạo Course
 * BE: GET /admin-it/search/programs?q=
 * -> SimpleProgramDto { id, title }
 */
export async function searchPrograms(q = "") {
    const res = await axiosClient.get(urls.searchPrograms, {
        params: {q},
    });
    const data = unwrap(res);
    const list = data.result ?? [];

    return list.map((p) => ({
        value: p.id,
        label: p.title || p.name || `Program #${p.id}`,
    }));
}

/**
 * Tìm Teacher cho form tạo Course
 * BE: GET /admin-it/search/teachers?q=
 * -> OptionDto { value, label }
 */
export async function searchTeachers(q = "") {
    const res = await axiosClient.get(urls.searchTeachers, {
        params: {q},
    });
    const data = unwrap(res);
    const list = data.result ?? [];

    return list.map((t) => ({
        value: t.value,
        label: t.label,
    }));
}

/**
 * Lấy Program detail để auto subjectId
 * BE: GET /program/{id}/detail
 * -> trong result có subject hoặc subjects
 */
export async function getProgramDetail(programId) {
    const res = await axiosClient.get(urls.getDetailProgram(programId));
    const data = unwrap(res);
    return data.result ?? data;
}

export async function fetchSubjectsByProgram(programId) {
    const res = await axiosClient.get(urls.programSubjectsOptions(programId));
    const data = unwrap(res);
    const list = data.result ?? [];
    return list.map((x) => ({
        value: x.value,
        label: x.label,
        order: x.order ?? x.orderNumber ?? null,
    }));
}

export async function fetchTimeslotsByCourse(courseId) {
    const res = await axiosClient.get(urls.adminCourseListTimeslots(courseId));
    const data = unwrap(res);
    return data.result ?? [];
}


export async function assignTeacher(courseId, teacherId) {
    const res = await axiosClient.put(urls.adminCourseAssignTeachers(courseId), {teacherId});
    return res?.result;
}

export async function fetchRoomOptions() {
    const res = await axiosClient.get(urls.roomOptions);
    const data = unwrap(res);
    const list = data.result ?? [];
    return list.map((x) => ({value: x.value, label: x.label}));
}
