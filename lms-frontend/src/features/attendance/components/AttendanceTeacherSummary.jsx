import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceService from '@/features/attendance/api/attendanceService.js';

const statusIcon = (status) => {
    switch (status) {
        case 1:
            return <i className="pi pi-check-circle" style={{ fontSize: '1.2rem' }} />;
        case 2:
            return <i className="pi pi-clock" style={{ fontSize: '1.2rem' }} />;
        case 0:
            return <i className="pi pi-times-circle" style={{ fontSize: '1.2rem' }} />;
        default:
            return <span className="text-400">-</span>;
    }
};

const statusStyle = (status) => {
    switch (status) {
        case 1:
            return { color: '#10b981', fontWeight: 'bold' };
        case 2:
            return { color: '#f59e0b', fontWeight: 'bold' };
        case 0:
            return { color: '#ef4444', fontWeight: 'bold' };
        default:
            return { color: '#94a3b8' };
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

    // Tính tổng cho toàn khóa học
    const overallStats = useMemo(() => {
        let totalPresent = 0, totalLate = 0, totalAbsent = 0;
        students.forEach(st => {
            st.attendancelist?.forEach(rec => {
                const s = rec?.status;
                if (s === 1) totalPresent++;
                else if (s === 2) totalLate++;
                else if (s === 0) totalAbsent++;
            });
        });
        const total = totalPresent + totalLate + totalAbsent;
        const attendanceRate = total > 0 ? ((totalPresent + totalLate) / total * 100).toFixed(1) : 0;
        return { totalPresent, totalLate, totalAbsent, attendanceRate };
    }, [students]);

    // Tính tổng theo từng buổi
    const perSessionTotals = useMemo(() => {
        return sessions.map((ss, idx) => {
            let present = 0, late = 0, absent = 0, empty = 0;
            students.forEach(st => {
                const orderIndex = (ss.order ?? (idx + 1)) - 1;
                const rec = st.attendancelist?.[orderIndex];
                const s = rec?.status;
                if (s === 1) present++;
                else if (s === 2) late++;
                else if (s === 0) absent++;
                else empty++;
            });
            return { present, late, absent, empty };
        });
    }, [sessions, students]);

    // Tính tổng theo từng học sinh
    const perStudentTotals = useMemo(() => {
        return students.map(st => {
            let present = 0, late = 0, absent = 0;
            st.attendancelist?.forEach(rec => {
                const s = rec?.status;
                if (s === 1) present++;
                else if (s === 2) late++;
                else if (s === 0) absent++;
            });
            const total = present + late + absent;
            const rate = total > 0 ? ((present + late) / total * 100).toFixed(0) : 0;
            return { present, late, absent, rate };
        });
    }, [students]);

    if (loading) {
        return (
            <div className="p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
                <div className="text-center p-5">
                    <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                    <p className="mt-3 text-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
                <Card>
                    <div className="text-center p-5">
                        <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                        <h3 className="text-600">Không có dữ liệu</h3>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header */}
            <div className="mb-4 p-4 bg-white border-round-lg shadow-3">
                <div className="flex justify-content-between align-items-center">
                    <div>
                        <h1 className="m-0 text-3xl font-bold text-900">
                            <i className="pi pi-chart-bar mr-3 text-blue-500"></i>
                            Tổng quan điểm danh
                        </h1>
                        <p className="mt-2 mb-0 text-600">
                            Báo cáo chi tiết tình hình tham dự của học sinh
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

            {/* Overall Statistics */}
            <div className="grid mb-3">
                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #10b981' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Tổng có mặt</div>
                                <div className="text-3xl font-bold text-900">{overallStats.totalPresent}</div>
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
                                <div className="text-500 font-medium mb-2">Tổng đi muộn</div>
                                <div className="text-3xl font-bold text-900">{overallStats.totalLate}</div>
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
                                <div className="text-500 font-medium mb-2">Tổng vắng mặt</div>
                                <div className="text-3xl font-bold text-900">{overallStats.totalAbsent}</div>
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

                <div className="col-12 md:col-3">
                    <Card className="shadow-2 border-round-lg" style={{ borderTop: '4px solid #3b82f6' }}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Tỷ lệ tham dự</div>
                                <div className="text-3xl font-bold text-900">{overallStats.attendanceRate}%</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(59, 130, 246, 0.1)'
                                }}
                            >
                                <i className="pi pi-percentage text-blue-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Legend Card */}
            <Card className="mb-3 shadow-2">
                <div className="flex align-items-center gap-4 flex-wrap">
                    <span className="font-semibold text-900">Chú thích:</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-check-circle text-green-500" style={{ fontSize: '1.2rem' }}></i>
                        <span className="text-700">Có mặt</span>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-clock text-orange-500" style={{ fontSize: '1.2rem' }}></i>
                        <span className="text-700">Đi muộn</span>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-times-circle text-red-500" style={{ fontSize: '1.2rem' }}></i>
                        <span className="text-700">Vắng mặt</span>
                    </div>
                </div>
            </Card>

            {/* Data Table */}
            <Card className="shadow-3">
                <div className="flex align-items-center gap-2 mb-3">
                    <i className="pi pi-table text-blue-500" style={{ fontSize: '1.5rem' }}></i>
                    <h3 className="m-0 text-xl font-semibold text-900">Bảng điểm danh chi tiết</h3>
                    <Badge value={`${students.length} học sinh`} severity="info" className="ml-2" />
                    <Badge value={`${sessions.length} buổi học`} severity="secondary" />
                </div>

                <Divider />

                <div className="overflow-auto border-round-md" style={{ border: '1px solid #e5e7eb' }}>
                    <DataTable
                        value={students}
                        dataKey="id"
                        scrollable
                        scrollHeight="600px"
                        showGridlines
                        stripedRows
                        size="small"
                        className="attendance-summary-table"
                    >
                        <Column
                            field="code"
                            header="Mã SV"
                            frozen
                            style={{ minWidth: '120px', fontWeight: '600', background: '#f8fafc' }}
                            headerStyle={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                        <Column
                            header="Họ và tên"
                            style={{ minWidth: '220px', fontWeight: '600', background: '#f8fafc' }}
                            headerStyle={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                zIndex: 2
                            }}
                            frozen
                            body={(st) => `${st.firstname ?? ''} ${st.lastname ?? ''}`}
                        />

                        {sessions.map((ss, idx) => (
                            <Column
                                key={ss.id ?? idx}
                                header={
                                    <div className="text-center">
                                        <div className="font-semibold">Buổi {ss.order ?? (idx + 1)}</div>
                                        <div className="text-xs font-normal mt-1">
                                            {ss.date ? new Date(ss.date).toLocaleDateString('vi-VN') : '-'}
                                        </div>
                                    </div>
                                }
                                style={{ minWidth: '100px', textAlign: 'center' }}
                                headerStyle={{
                                    background: '#f1f5f9',
                                    textAlign: 'center',
                                    borderLeft: '1px solid #cbd5e1',
                                    zIndex: 1
                                }}
                                bodyStyle={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    borderLeft: '1px solid #e5e7eb'
                                }}
                                body={(st) => {
                                    const orderIndex = (ss.order ?? (idx + 1)) - 1;
                                    const rec = st.attendancelist?.[orderIndex];
                                    const val = rec?.status;
                                    return <span style={statusStyle(val)}>{statusIcon(val)}</span>;
                                }}
                                footer={() => {
                                    const t = perSessionTotals[idx];
                                    return t ? (
                                        <div className="flex flex-column gap-1 text-xs font-semibold">
                                            <div className="text-green-600">✔ {t.present}</div>
                                            <div className="text-orange-600">⏰ {t.late}</div>
                                            <div className="text-red-600">✖ {t.absent}</div>
                                        </div>
                                    ) : null;
                                }}
                            />
                        ))}

                        <Column
                            header="Tổng kết"
                            style={{ minWidth: '150px', background: '#fef3c7' }}
                            headerStyle={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                            bodyStyle={{ textAlign: 'center', verticalAlign: 'middle' }}
                            body={(st, { rowIndex }) => {
                                const totals = perStudentTotals[rowIndex];
                                return (
                                    <div className="flex flex-column gap-1 text-xs">
                                        <div className="font-semibold text-900">
                                            Tỷ lệ: {totals.rate}%
                                        </div>
                                        <div className="flex justify-content-center gap-2">
                                            <span className="text-green-600">✔{totals.present}</span>
                                            <span className="text-orange-600">⏰{totals.late}</span>
                                            <span className="text-red-600">✖{totals.absent}</span>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </DataTable>
                </div>

                <Divider />

                <div className="flex justify-content-between align-items-center">
                    <Button
                        label="Quay lại"
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-secondary"
                        onClick={() => navigate(-1)}
                    />

                    <div className="flex gap-2">
                        <Button
                            label="Xuất Excel"
                            icon="pi pi-file-excel"
                            className="p-button-success p-button-outlined"
                        />
                        <Button
                            label="In báo cáo"
                            icon="pi pi-print"
                            className="p-button-info p-button-outlined"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceTeacherSummary