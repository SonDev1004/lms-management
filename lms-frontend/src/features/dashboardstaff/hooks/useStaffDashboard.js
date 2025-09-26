// src/features/dashboardstaff/hooks/useStaffDashboard.js
import { useState, useMemo } from 'react';
import * as mock from '../mocks/mockData';

export default function useStaffDashboard() {
    const [summary] = useState(mock.summary);
    const [enrollment] = useState(mock.enrollmentOverTime);
    const [levels] = useState(mock.levelDistribution);
    const [classes] = useState(mock.classesPerTeacher);
    const [recent] = useState(mock.recentActivities);
    const [upcoming] = useState(mock.upcomingActivities);
    const [students] = useState(mock.newStudents);
    const [leaveRequests] = useState(mock.mockLeaveRequests);

    const csvForExport = useMemo(() => {
        const rows = [
            'Name,Email,Course,Progress,Status,JoinDate',
            ...students.map(
                (s) =>
                    `${s.name},${s.email},${s.course},${s.progress},${s.status},${s.joinDate}`
            ),
        ];
        return rows.join('\n');
    }, [students]);

    function downloadCSV() {
        const blob = new Blob([csvForExport], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'new-students.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    return {
        summary,
        enrollment,
        levels,
        classes,
        recent,
        upcoming,
        students,
        leaveRequests,
        downloadCSV,
    };
}
