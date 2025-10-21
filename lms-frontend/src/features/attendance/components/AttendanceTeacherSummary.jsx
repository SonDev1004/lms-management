// AttendanceSummary.jsx
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceService from '@/features/attendance/api/attendanceService.js';

const statusIcon = (status) => {
    switch (status) {
        case 1:
            return <i className="pi pi-check" />;    // Có mặt
        case 2:
            return <i className="pi pi-clock" />;    // Đi trễ
        case 0:
            return <i className="pi pi-times" />;    // Vắng
        default:
            return '-';
    }
};
const statusStyle = (status) => {
    switch (status) {
        case 1:
            return { color: '#22c55e' };   // green
        case 2:
            return { color: '#f59e0b' };   // amber
        case 0:
            return { color: '#ef4444' };   // red
        default:
            return {};
    }
};

const AttendanceTeacherSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await AttendanceService.getAttendanceSummary(courseId);
                if (mounted) setSummary(data);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [courseId]);

    const sessions = summary?.sessions ?? [];
    const students = summary?.students ?? [];

    // Tính tổng theo từng buổi (optional)
    const perSessionTotals = useMemo(() => {
        return sessions.map(ss => {
            const idx = (ss.order ?? 1) - 1;
            let present = 0, late = 0, absent = 0, empty = 0;
            students.forEach(st => {
                const rec = st.attendancelist?.[idx];
                const s = rec?.status;
                if (s === 1) present++;
                else if (s === 2) late++;
                else if (s === 0) absent++;
                else empty++;
            });
            return { present, late, absent, empty };
        });
    }, [sessions, students]);

    if (loading) return <p>Đang tải...</p>;
    if (!summary) return <p>Không có dữ liệu.</p>;

    return (
        <div className="mt-2">
            <Card
                title="Attendance Summary"
                subTitle={
                    <div className="flex gap-2 align-items-center">
                        <Tag value="Present" icon="pi pi-check" />
                        <Tag value="Late" icon="pi pi-clock" severity="warning" />
                        <Tag value="Absent" icon="pi pi-times" severity="danger" />
                    </div>
                }
                className='w-full overflow-hidden'
            >
                <div className="overflow-auto">
                    <DataTable value={students} dataKey="id" scrollable scrollHeight="120vh" showGridlines stripedRows
                        style={{ width: '950px' }} >
                        <Column field="code" header="Student ID" frozen style={{ minWidth: '100px' }} headerStyle={{ whiteSpace: 'nowrap' }} />
                        <Column
                            header="Student Name"
                            style={{ minWidth: '200px' }}
                            headerStyle={{ whiteSpace: 'nowrap', zIndex: 2 }}
                            frozen
                            body={(st) => `${st.firstname ?? ''} ${st.lastname ?? ''}`}

                        />
                        {sessions.map((ss, idx) => (
                            <Column
                                key={ss.id ?? idx}
                                header={
                                    ss.date
                                        ? new Date(ss.date).toLocaleDateString('vi-VN')
                                        : `Buổi ${ss.order}`
                                }
                                style={{ minWidth: '100px' }}
                                headerStyle={{ whiteSpace: 'nowrap', textAlign: 'center', zIndex: 1 }}
                                bodyStyle={{ textAlign: 'center', verticalAlign: 'middle' }}
                                body={(st) => {
                                    const orderIndex = (ss.order ?? (idx + 1)) - 1; // 0-based
                                    const rec = st.attendancelist?.[orderIndex];
                                    const val = rec?.status;
                                    return <span style={statusStyle(val)}>{statusIcon(val)}</span>;
                                }}
                                footer={() => {
                                    const t = perSessionTotals[idx];
                                    return t
                                        ? (
                                            <div className="flex gap-2 justify-content-center text-xs">
                                                <span title="Present">✔ {t.present}</span>
                                                <span title="Late">⏰ {t.late}</span>
                                                <span title="Absent">✖ {t.absent}</span>
                                            </div>
                                        )
                                        : null;
                                }}

                            />
                        ))}
                    </DataTable>
                </div>
                <div className="flex justify-content-start gap-2 mt-3">
                    <Button label="Back" onClick={() => navigate(-1)} />
                </div>
            </Card>
        </div>
    );
};

export default AttendanceTeacherSummary;
