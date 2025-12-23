import { AppUrls } from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

const studentCountCache = new Map();

function resolveUrl(maybeFn, ...args) {
    return typeof maybeFn === "function" ? maybeFn(...args) : maybeFn;
}

async function getSessionsByCourse(courseId) {
    const url = resolveUrl(AppUrls.getCourseSessions, courseId);
    try {
        const res = await axiosClient.get(url);
        return res.data?.result ?? [];
    } catch (err) {
        console.error("Lỗi khi tải danh sách buổi học:", err);
        throw err;
    }
}

async function getCourseStudentCount(courseId) {
    const key = String(courseId);
    if (studentCountCache.has(key)) return studentCountCache.get(key);

    try {
        const url = resolveUrl(AppUrls.getAttendanceSummary, courseId);
        const res = await axiosClient.get(url);

        const payload = res.data?.result ?? res.data ?? {};
        const total =
            payload?.totalStudents ??
            payload?.total_students ??
            payload?.studentCount ??
            payload?.student_count ??
            payload?.courseStudentCount ??
            payload?.course_student_count;

        const n = Number(total);
        if (Number.isFinite(n) && n >= 0) {
            studentCountCache.set(key, n);
            return n;
        }
    } catch (e) {
        console.error("[getCourseStudentCount] attendance summary failed:", e);
    }

    try {
        const url = resolveUrl(AppUrls.getTeacherCourses);
        const res = await axiosClient.get(url);

        const courses = res.data?.result ?? [];
        const course = courses.find((c) => String(c.id) === key);

        const total =
            course?.studentCount ??
            course?.student_count ??
            course?.totalStudents ??
            course?.total_students ??
            course?.noStudent ??
            course?.capacity;

        const n = Number(total) || 0;
        studentCountCache.set(key, n);
        return n;
    } catch (e) {
        console.error("[getCourseStudentCount] teacher courses failed:", e);
        studentCountCache.set(key, 0);
        return 0;
    }
}

function clearStudentCountCache(courseId) {
    if (courseId == null) {
        studentCountCache.clear();
        return;
    }
    studentCountCache.delete(String(courseId));
}

const SessionService = {
    getSessionsByCourse,
    getCourseStudentCount,
    clearStudentCountCache,
};

export default SessionService;
