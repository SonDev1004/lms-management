import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import {Calendar} from 'primereact/calendar';

import AttendanceTable from './AttendanceTable';
import AttendanceService from '@/features/attendance/api/attendanceService.js';

const attendance_types = [
    {label: 'Có mặt', value: 1},
    {label: 'Đi trễ', value: 2},
    {label: 'Vắng', value: 0},
];

const AttendancePanel = () => {
    const navigate = useNavigate();
    const {courseId, sessionId} = useParams();
    const location = useLocation();

    const dateFromSession =
        location.state?.date ||
        new URLSearchParams(location.search).get('date') ||
        null;

    const [selectedDate] = useState(
        dateFromSession ? new Date(dateFromSession) : new Date()
    );
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load danh sách điểm danh theo session
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await AttendanceService.getAttendanceBySession(sessionId);
                if (mounted) setAttendanceData(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi load attendance:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [sessionId]);

    // Đổi trạng thái
    const handleAttendanceChange = (studentId, value) => {
        setAttendanceData(prev =>
            prev.map(item =>
                item.id === studentId ? {...item, attendance: value} : item
            )
        );
    };
	// Đổi lý do vắng
    const handleReasonChange = (studentId, reason) => {
        setAttendanceData(prev =>
            prev.map(item =>
                item.id === studentId ? {...item, note: reason} : item
            )
        );
    };

	// Lưu điểm danh
    const handleSaveAttendance = async () => {
        try {
            const isoDate = selectedDate.toISOString().slice(0, 10); // yyyy-MM-dd
            const students = attendanceData.map(s => ({
                id: Number(s.id),
                attendance: Number(s.attendance ?? 0), // 0/1/2
                note: s.note ?? null,

            }));

            console.log('Submit payload:', {
                sessionId: Number(sessionId),
                courseId: Number(courseId),
                date: isoDate,
                students
            });

            await AttendanceService.markAttendance(
                Number(sessionId),
                students,
                Number(courseId),
                isoDate
            );

            alert('✅ Điểm danh thành công!');
        } catch (e) {
            console.error(e);
            alert('❌ Điểm danh thất bại!');
        }
    };


    return (
        <div className="grid mt-2">
            <Card title="Bảng điểm danh">
                <div className="formgrid grid">
                    <div className="field col">
                        <label>Buổi học</label>
                        <Calendar value={selectedDate} dateFormat="dd/mm/yy" readOnlyInput/>
                    </div>
                </div>

                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <AttendanceTable
                        attendanceList={attendanceData}
                        attendance_types={attendance_types}
                        handleAttendanceChange={handleAttendanceChange}
                        handleReasonChange={handleReasonChange}
                        renderFooter={() => null}
                    />
                )}

                <div className="flex justify-content-between mt-4">
                    <Button label="Quay lại" onClick={() => navigate(-1)}/>
                    <Button label="Lưu" onClick={handleSaveAttendance}/>
                </div>
            </Card>
        </div>
    );
};

export default AttendancePanel;
