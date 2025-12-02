import {AppUrls} from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

// lấy sessions theo ngày
async function getSessionsByDate(courseId, date) {
    const res = await axiosClient.get(AppUrls.getSessionsByDate, {
        params: {courseId, date}
    });
    return res.data?.result ?? [];
}

// lấy danh sách học viên theo session
async function getAttendanceBySession(sessionId) {
    const res = await axiosClient.get(AppUrls.getAttendanceBySession(sessionId));
    return res.data?.result ?? [];
}

export function fetchStudentAttendanceOverview() {
    return axiosClient.get(urls.studentAttendanceOverview);
}
// lưu điểm danh
async function markAttendance(sessionId, students, courseId, date) {
    const res = await axiosClient.post(AppUrls.markAttendance, {
        sessionId: Number(sessionId),
        courseId: Number(courseId),
        date, // yyyy-MM-dd
        students,
    });
    return res.data?.result;
}


// tổng hợp điểm danh
async function getAttendanceSummary(courseId) {
    const res = await axiosClient.get(AppUrls.getAttendanceSummary(courseId));
    return res.data?.result;
}

const AttendanceService = {
    getSessionsByDate,
    getAttendanceBySession,
    markAttendance,
    getAttendanceSummary,
};

export default AttendanceService;
