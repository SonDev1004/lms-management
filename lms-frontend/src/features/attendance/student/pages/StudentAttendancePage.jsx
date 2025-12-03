import {useEffect, useMemo, useState} from 'react';
import {Card} from 'primereact/card';
import {ProgressBar} from 'primereact/progressbar';
import {Dropdown} from 'primereact/dropdown';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Tag} from 'primereact/tag';
import {fetchStudentAttendanceOverview, getStudentAttendanceDetails} from '@/features/attendance/api/attendanceService';
import './student-attendance.css';

export default function StudentAttendancePage() {
    const [overview, setOverview] = useState(null);
    const [details, setDetails] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [ov, det] = await Promise.all([
                    fetchStudentAttendanceOverview(),
                    getStudentAttendanceDetails(selectedCourse?.value),
                ]);
                setOverview(ov);
                setDetails(det);
                console.log('Attendance details:', det);
                console.log('Attendance overview:', ov);
                const map = new Map();
                det.forEach((d) => {
                    if (!map.has(d.courseId)) {
                        map.set(d.courseId, d.courseTitle);
                    }
                });
                const opts = Array.from(map.entries()).map(([id, title]) => ({
                    label: title,
                    value: id,
                }));
                setCourseOptions(opts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [selectedCourse]);

    const rate = overview?.attendanceRate ?? overview?.rate ?? 0;
    const present = overview?.present ?? 0;
    const late = overview?.late ?? 0;
    const absent = overview?.absent ?? 0;
    const excused = overview?.excused ?? 0;

    const totalSessions = useMemo(
        () => details.length,
        [details]
    );

    const statusTemplate = (row) => {
        const st = row.attendance;
        let value = 'Not recorded';
        let severity = 'info';

        if (st === 1) {
            value = 'Present';
            severity = 'success';
        } else if (st === 2) {
            value = 'Late';
            severity = 'warning';
        } else if (st === 0) {
            value = 'Absent';
            severity = 'danger';
        } else if (st === 3) {
            value = 'Excused';
            severity = 'info';
        }

        return <Tag value={value} severity={severity}/>;
    };

    const dateTemplate = (row) => row.date;
    const timeTemplate = (row) => {
        const start = row.startTime?.slice(0, 5) ?? '';
        const end = row.endTime?.slice(0, 5) ?? '';
        return `${start} - ${end}`;
    };

    return (
        <div className="stu-att-shell">
            {/* OVERVIEW CARD */}
            <Card className="stu-att-card">
                <div className="stu-att-title">
                    <i className="pi pi-user"/>
                    <span>My Attendance Overview</span>
                </div>

                <div className="stu-att-stats">
                    <div className="stat">
                        <div className="stat-value stat-green">{present}</div>
                        <div className="stat-label">Present</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-amber">{late}</div>
                        <div className="stat-label">Late</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-red">{absent}</div>
                        <div className="stat-label">Absent</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value stat-blue">{excused}</div>
                        <div className="stat-label">Excused</div>
                    </div>
                </div>
                <div className="rate-head">
                    Attendance Rate
                    {totalSessions > 0 && (
                        <span className="rate-total">({totalSessions} sessions)</span>
                    )}
                </div>
                <div className="rate-wrap">
                    <ProgressBar value={rate} showValue={false}/>
                    <span className="rate-chip">{rate}%</span>
                </div>
            </Card>

            {/* FILTER + TABLE DETAILS */}
            <Card className="stu-att-table-card">
                <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                    <h3 style={{margin: 0}}>Session Details</h3>
                    <Dropdown
                        value={selectedCourse}
                        options={courseOptions}
                        onChange={(e) => setSelectedCourse(e.value ? e : null)}
                        placeholder="All courses"
                        showClear
                        style={{minWidth: 260}}
                    />
                </div>

                <DataTable
                    value={details}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage="No attendance data."
                    responsiveLayout="scroll"
                    className="stu-att-table"
                >
                    <Column field="date" header="Date" body={dateTemplate} sortable/>
                    <Column header="Time" body={timeTemplate} sortable/>
                    <Column field="courseTitle" header="Course" sortable/>
                    <Column header="Status" body={statusTemplate} sortable/>
                    <Column field="note" header="Note"/>
                </DataTable>
            </Card>
        </div>
    );
}
