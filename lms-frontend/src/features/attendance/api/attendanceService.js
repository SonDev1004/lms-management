export const fetchAttendanceHistory = (courseId, studentId) => {
    const history = [
        {session: 1, date: '2025-06-01', present: true},
        {session: 2, date: '2025-06-03', present: true},
        {session: 3, date: '2025-06-07', present: false},
        {session: 4, date: '2025-06-10', present: true},
        {session: 5, date: '2025-06-12', present: true},
        {session: 6, date: '2025-06-14', present: false},
        {session: 7, date: '2025-06-17', present: true},
        {session: 8, date: '2025-06-20', present: true},
        {session: 9, date: '2025-06-22', present: false},
        {session: 10, date: '2025-06-25', present: true},
        {session: 11, date: '2025-06-27', present: true},
        {session: 12, date: '2025-06-29', present: true},
        {session: 13, date: '2025-07-01', present: false}
    ];

    return new Promise((resolve) => {
        setTimeout(() => resolve(history), 300);
    });
};
