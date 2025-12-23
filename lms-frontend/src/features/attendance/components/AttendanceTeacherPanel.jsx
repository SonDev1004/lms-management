import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

import AttendanceTable from './AttendanceTeacherTable';
import AttendanceService from '@/features/attendance/api/attendanceService.js';

const attendance_types = [
    { label: 'Present', value: 1 },
    { label: 'Late', value: 2 },
    { label: 'Absent', value: 0 },
];

const AttendanceTeacherPanel = () => {
    const navigate = useNavigate();
    const { courseId, sessionId } = useParams();
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
                item.id === studentId ? { ...item, attendance: value } : item
            )
        );
    };

    // Đổi lý do vắng
    const handleReasonChange = (studentId, reason) => {
        setAttendanceData(prev =>
            prev.map(item =>
                item.id === studentId ? { ...item, note: reason } : item
            )
        );
    };

    // Lưu điểm danh
    const handleSaveAttendance = async () => {
        try {
            const isoDate = selectedDate.toISOString().slice(0, 10);
            const students = attendanceData.map(s => ({
                id: Number(s.id),
                attendance: Number(s.attendance ?? 0),
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

    // Calculate statistics
    const totalStudents = attendanceData.length;
    const presentCount = attendanceData.filter(s => s.attendance === 1).length;
    const lateCount = attendanceData.filter(s => s.attendance === 2).length;
    const absentCount = attendanceData.filter(s => s.attendance === 0 || s.attendance === null || s.attendance === undefined).length;
    const attendanceRate = totalStudents > 0 ? ((presentCount + lateCount) / totalStudents * 100).toFixed(1) : 0;

    return (
        <div className="p-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="mb-4 p-4 bg-white border-round-lg shadow-3">
                <div className="flex justify-content-between align-items-center">
                    <div>
                        <h1 className="m-0 text-3xl font-bold text-900">
                            <i className="pi pi-check-circle mr-3 text-green-500"></i>
                            Điểm danh buổi học
                        </h1>
                        <p className="mt-2 mb-0 text-600">
                            Quản lý và ghi nhận sự có mặt của học sinh
                        </p>
                    </div>

                    <Button
                        label="Quay lại"
                        icon="pi pi-arrow-left"
                        className="p-button-text"
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>

            {/* Session Info & Actions */}
            <Card className="mb-3 shadow-3">
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="flex align-items-center gap-3 mb-3">
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white'
                                }}
                            >
                                <i className="pi pi-calendar text-2xl"></i>
                            </div>
                            <div>
                                <label className="text-600 text-sm mb-1 block">Ngày học</label>
                                <Calendar
                                    value={selectedDate}
                                    dateFormat="dd/mm/yy"
                                    readOnlyInput
                                    className="w-full"
                                    inputClassName="font-semibold text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex gap-2 justify-content-end">
                            <Button
                                label="Xem tổng quan"
                                icon="pi pi-chart-bar"
                                className="p-button-outlined p-button-info"
                                onClick={() => navigate('full')}
                            />
                            <Button
                                label="QR Code"
                                icon="pi pi-qrcode"
                                className="p-button-outlined p-button-success"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid mb-3">
                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #3b82f6' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Tổng số</div>
                                <div className="text-3xl font-bold text-900">{totalStudents}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(59, 130, 246, 0.1)'
                                }}
                            >
                                <i className="pi pi-users text-blue-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #10b981' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Có mặt</div>
                                <div className="text-3xl font-bold text-900">{presentCount}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(16, 185, 129, 0.1)'
                                }}
                            >
                                <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #f59e0b' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Đi muộn</div>
                                <div className="text-3xl font-bold text-900">{lateCount}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(245, 158, 11, 0.1)'
                                }}
                            >
                                <i className="pi pi-clock text-orange-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #ef4444' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Vắng mặt</div>
                                <div className="text-3xl font-bold text-900">{absentCount}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(239, 68, 68, 0.1)'
                                }}
                            >
                                <i className="pi pi-times-circle text-red-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Attendance Rate Bar */}
            <Card className="mb-3 shadow-2">
                <div className="flex align-items-center justify-content-between mb-2">
                    <h3 className="m-0 text-lg font-semibold">Tỷ lệ tham dự</h3>
                    <Badge
                        value={`${attendanceRate}%`}
                        severity={attendanceRate >= 80 ? 'success' : attendanceRate >= 60 ? 'warning' : 'danger'}
                        style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}
                    />
                </div>
                <div className="w-full bg-gray-200 border-round-lg" style={{ height: '32px', overflow: 'hidden' }}>
                    <div
                        className="h-full flex align-items-center justify-content-center text-white font-semibold transition-all duration-300"
                        style={{
                            width: `${attendanceRate}%`,
                            background: attendanceRate >= 80
                                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                : attendanceRate >= 60
                                    ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                                    : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                            minWidth: '60px'
                        }}
                    >
                        {attendanceRate}%
                    </div>
                </div>
            </Card>

            {/* Attendance Table */}
            <Card className="shadow-3">
                <div className="flex align-items-center gap-2 mb-3">
                    <i className="pi pi-list text-blue-500" style={{ fontSize: '1.5rem' }}></i>
                    <h3 className="m-0 text-xl font-semibold text-900">Danh sách điểm danh</h3>
                </div>

                <Divider />

                {loading ? (
                    <div className="text-center p-5">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                        <p className="mt-3 text-600">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <AttendanceTable
                        attendanceList={attendanceData}
                        attendance_types={attendance_types}
                        handleAttendanceChange={handleAttendanceChange}
                        handleReasonChange={handleReasonChange}
                        renderFooter={() => null}
                    />
                )}

                <Divider />

                <div className="flex justify-content-between align-items-center">
                    <Button
                        label="Quay lại"
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-secondary"
                        onClick={() => navigate(-1)}
                    />
                    <Button
                        label="Lưu điểm danh"
                        icon="pi pi-save"
                        className="p-button-lg"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none'
                        }}
                        onClick={handleSaveAttendance}
                        disabled={loading}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AttendanceTeacherPanel;