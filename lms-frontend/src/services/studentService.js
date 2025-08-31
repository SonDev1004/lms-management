import axiosClient from "services/axiosClient.jsx";

async function getMyCourses(params = {}) {
    const res = await axiosClient.get('student/me/courses', {params});
    return pickItems(res).map(mapCourse);

}

function pickItems(res) {
    return Array.isArray(res?.data?.result?.items) ? res.data.result.items : [];
}

function pickMeta(res) {
    const r = res?.data?.result ?? {};
    return {
        page: r.page ?? 1,
        size: r.size ?? 0,
        totalItems: r.totalItems ?? 0,
        totalPages: r.totalPages ?? 0,
        hasNext: !!r.hasNext,
        hasPrevious: !!r.hasPrevious,
    }
}

function buildSchedule(daysText, timeText) {
    return [daysText, timeText].filter(Boolean).join(' ').trim(); // "T3-T5 18:00-19:30"
}

//Map Be với model UI
function mapCourse(row = {}) {
    // status: 0=sắp mở, 1=đang học, 2=đã học (suy từ BE)
    const statusCode = Number(row.status);
    const statusText = (row.statusText || '').trim().toLowerCase();
    const isActive = statusText === 'đang học' || statusCode === 1;

    // Nếu BE trả "YYYY-MM-DD", nối T00:00:00 để Date() không lệch TZ
    const startDate = row.startDate
        ? (/^\d{4}-\d{2}-\d{2}$/.test(row.startDate)
            ? `${row.startDate}T00:00:00`
            : row.startDate)
        : null;

    return {
        id: String(row.courseId ?? ''),
        code: (row.courseCode || '').trim(),
        title: (row.courseTitle || '—').trim(),
        subject: (row.subjectName || '').trim(),
        description: row.description ?? '',
        teacher: (row.teacherName || '').trim(),
        room: (row.roomName || '').trim(),
        start_date: startDate,
        session_number: Number(row.plannedSession ?? 0),
        attended_sessions: Number(row.sessionsDone ?? 0),
        schedule: buildSchedule(row.daysText, row.timeText),
        is_active: Boolean(isActive),
        reminders: [],

        // raw
        _subjectId: row.subjectId ?? null,
        _teacherId: row.teacherId ?? null,
        _roomId: row.roomId ?? null,
        _days: Array.isArray(row.days) ? row.days : [],
        _status: statusCode,
        _statusText: row.statusText ?? '',
    };
}

const StudentService = {
    getMyCourses
};
export default StudentService;
