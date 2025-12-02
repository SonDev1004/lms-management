import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import "./student-attendance.css";

import { fetchStudentAttendanceOverview } from "@/features/attendance/api/attendanceService.js";

export default function StudentAttendancePage() {
    const [stats, setStats] = useState({
        present: 0,
        late: 0,
        absent: 0,
        excused: 0,
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetchStudentAttendanceOverview();
                const data = res.data?.result || res.data;

                setStats({
                    present: data.present ?? 0,
                    late: data.late ?? 0,
                    absent: data.absent ?? 0,
                    excused: data.excused ?? 0,
                });
            } catch (err) {
                toast.current?.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: "Không tải được thống kê điểm danh.",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const total = stats.present + stats.late + stats.absent + stats.excused;

    const rate = useMemo(() => {
        if (!total) return 0;
        const attended = total - stats.absent;
        return +((attended * 100) / total).toFixed(1);
    }, [total, stats.absent]);

    return (
        <div className="stu-att-shell">
            <Toast ref={toast} />

            <Card className="stu-att-card">
                <div className="stu-att-title">
                    <i className="pi pi-user" />
                    <span>My Attendance Overview</span>
                </div>

                <div className="stu-att-stats">
                    <div className="stat">
                        <div className="stat-value stat-green">
                            {loading ? "-" : stats.present}
                        </div>
                        <div className="stat-label">Present</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-amber">
                            {loading ? "-" : stats.late}
                        </div>
                        <div className="stat-label">Late</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-red">
                            {loading ? "-" : stats.absent}
                        </div>
                        <div className="stat-label">Absent</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-blue">
                            {loading ? "-" : stats.excused}
                        </div>
                        <div className="stat-label">Excused</div>
                    </div>
                </div>

                <div className="rate-head">Attendance Rate</div>
                <div className="rate-wrap">
                    <ProgressBar value={rate} showValue={false} />
                    <span className="rate-chip">{rate}%</span>
                </div>
            </Card>
        </div>
    );
}
