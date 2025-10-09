import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';

export default function OverviewTab({ teacher }) {
    const chartData = {
        labels: ['Submitted Attendance', 'On-time Grading', 'Feedback Count'],
        datasets: [{ data: [82, 74, teacher.feedback?.length || 0] }]
    };

    return (
        <div className="p-grid p-nogutter tp-grid">
            <Card className="tp-col">
                <h3>Subjects & Levels</h3>
                <div className="tp-badges">
                    {(teacher.subjectsDetail || []).map(s => (
                        <Tag key={s.code} value={s.code} rounded className="mr-2 mb-2" />
                    ))}
                </div>

                <h3 className="mt-4">Current Workload</h3>
                <div className="tp-kv-inline">
                    <span>{teacher.workload?.weeklyHours} hrs/week</span>
                    <span>• {teacher.workload?.classCount} classes</span>
                    <span>• {teacher.workload?.campusCount} campuses</span>
                </div>

                <div className="mt-4"><Chart type="doughnut" data={chartData} /></div>
            </Card>

            <Card className="tp-col">
                <h3>Contact & Address</h3>
                <div className="tp-kv"><span>Email</span>
                    <strong className="tp-copy" data-copy={teacher.email}>{teacher.email}</strong></div>
                <div className="tp-kv"><span>Phone</span>
                    <strong className="tp-copy" data-copy={teacher.phone}>{teacher.phone}</strong></div>
                <div className="tp-kv"><span>Address</span><strong>{teacher.address}</strong></div>

                <h3 className="mt-4">Emergency Contact</h3>
                <div className="tp-kv"><span>Contact</span><strong>{teacher.emergency?.name}</strong></div>
                <div className="tp-kv"><span>Phone</span><strong>{teacher.emergency?.phone}</strong></div>

                <h3 className="mt-4">Certificates</h3>
                <ul className="tp-list">
                    {(teacher.certificates || []).map(c => (
                        <li key={c.id}>
                            <Tag value={c.status} severity={c.status === 'valid' ? 'success' : c.status === 'expiring' ? 'warning' : 'info'} rounded className="mr-2" />
                            {c.name} – exp: {c.expiresAt || '—'}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
