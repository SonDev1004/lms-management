import { useMemo } from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import "./student-attendance.css";

const mock = {
    present: 18,
    late: 3,
    absent: 1,
    excused: 1,
};

export default function StudentAttendancePage() {
    const total = mock.present + mock.late + mock.absent + mock.excused;
    const rate = useMemo(() => {
        if (!total) return 0;
        const attended = total - mock.absent;
        return +(attended * 100 / total).toFixed(1);
    }, [total]);

    return (
        <div className="stu-att-shell">
            <Card className="stu-att-card">
                <div className="stu-att-title">
                    <i className="pi pi-user" />
                    <span>My Attendance Overview</span>
                </div>

                <div className="stu-att-stats">
                    <div className="stat">
                        <div className="stat-value stat-green">{mock.present}</div>
                        <div className="stat-label">Present</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-amber">{mock.late}</div>
                        <div className="stat-label">Late</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-red">{mock.absent}</div>
                        <div className="stat-label">Absent</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-blue">{mock.excused}</div>
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
