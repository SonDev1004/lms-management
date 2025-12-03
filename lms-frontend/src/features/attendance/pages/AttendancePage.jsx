import React, { useEffect, useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceService from '../api/attendanceService';

const AttendancePage = ({ sessionId }) => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    useEffect(() => {
        let mounted = true;

        if (sessionId) {
            AttendanceService.getAttendanceBySession(sessionId)
                .then((res) => {
                    if (!mounted) return;
                    setAttendanceHistory(Array.isArray(res) ? res : []);
                })
                .catch(() => {
                    if (!mounted) return;
                    setAttendanceHistory([]);
                });
        } else {
            setAttendanceHistory([]);
        }

        return () => {
            mounted = false;
        };
    }, [sessionId]);

    const formatDate = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="attendance-page">
            <AttendanceTable
                attendanceHistory={attendanceHistory}
                formatDate={formatDate}
            />
        </div>
    );
};

export default AttendancePage;
