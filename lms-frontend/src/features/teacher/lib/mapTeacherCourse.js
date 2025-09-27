export function mapTeacherCourse(apiResponse) {
    if (!apiResponse || !apiResponse.result) return {items: [], page: 0, size: 0, totalItems: 0, totalPages: 0};
    const {page, size, totalItems, totalPages, hasNext, hasPrevious, items} = apiResponse.result;

    return {
        page,
        size,
        totalItems,
        totalPages,
        hasNext,
        hasPrevious,
        items: (items ?? []).map(c => ({
            id: c.courseId,
            code: c.courseCode,
            title: c.courseTitle,
            subjectId: c.subjectId,
            subjectName: c.subjectName,
            description: c.description,
            teacherId: c.teacherId,
            teacherName: c.teacherName,
            roomId: c.roomId,
            roomName: c.roomName,
            daysText: c.daysText,
            days: c.days ?? [],
            timeText: c.timeText,
            startDate: c.startDate,
            plannedSession: c.plannedSession,
            sessionsDone: c.sessionsDone,
            status: c.status,
            statusText: c.statusText,
            studentNumber: c.studentNumber,
            students: (c.studentList ?? []).map(s => ({
                code: s.studentCode,
                name: s.studentName,
                phone: s.studentPhone,
                email: s.studentEmail,
                status: s.status,
                statusName: s.statusName,
                presentCount: s.presentCount,
                plannedSessions: s.plannedSessions,
                attendanceText: `${s.presentCount}/${s.plannedSessions}`,
                attendanceRate: s.plannedSessions > 0
                    ? Math.round((s.presentCount / s.plannedSessions) * 100)
                    : 0
            }))
        }))
    };
}
