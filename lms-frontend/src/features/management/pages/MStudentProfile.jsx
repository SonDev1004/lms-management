import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import dayjs from 'dayjs';

import { mockStudents } from '../mocks/students';
import StatusTag from '../components/StatusTag';
import './student-profile.css';

export default function StudentProfile() {
    const navigate = useNavigate();
    const { id } = useParams();

    const stu = useMemo(() => mockStudents.find(s => s.id === id) ?? mockStudents[0], [id]);

    // ===== Helpers =====
    const formatPct = (n) => `${n}%`;
    const exportAttendance = () => {
        const headers = ['date','course','status'];
        const rows = stu.attendance?.map(r => [r.date, r.course, r.status]) ?? [];
        const csv = [headers.join(','), ...rows.map(r => r.map(x=>JSON.stringify(x)).join(','))].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }));
        a.download = `${stu.id}-attendance.csv`; a.click();
    };
    const downloadTranscript = () => {
        const headers = ['Subject','Midterm','Final','Assignments','Total'];
        const rows = Object.entries(stu.grades || {}).map(([k,v]) => [
            k, `${v.midterm}%`, `${v.final}%`, `${v.assignments}%`,
            `${Math.round((v.midterm + v.final + v.assignments)/3)}%`
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }));
        a.download = `${stu.id}-transcript.csv`; a.click();
    };

    // derived for tabs (URL không đổi để đơn giản)
    const [tab, setTab] = React.useState('overview');

    return (
        <div className="profile-wrap">
            {/* back + title */}
            <div className="back-row">
                <Button text rounded icon="pi pi-arrow-left" onClick={()=>navigate('..')} />
                <span className="back-text" onClick={()=>navigate('..')}>Back to Students</span>
            </div>

            <div className="title-row">
                <h1 className="title">Student Profile</h1>
                <div className="subtitle">Detailed information for {stu.name}</div>
                <Button label="Edit Profile" icon="pi pi-pen-to-square" className="p-button-lg edit-btn" />
            </div>

            {/* top card */}
            <div className="card header-card">
                <div className="left">
                    <Avatar image={stu.avatar} label={!stu.avatar ? stu.name[0] : undefined} size="xlarge" shape="circle" />
                    <div className="info">
                        <div className="name">{stu.name}</div>
                        <div className="major">{stu.class}</div>
                        <StatusTag value={stu.status} />
                        <div className="contact-row">
                            <i className="pi pi-envelope" />
                            <span>{stu.email}</span>
                        </div>
                    </div>
                </div>

                <div className="right">
                    <div className="meta">
                        <div className="label">Student ID</div>
                        <div className="value">{stu.id}</div>
                    </div>
                    <div className="meta">
                        <div className="label">GPA</div>
                        <div className="value gpa">{stu.gpa?.toFixed(2)}</div>
                    </div>
                    <div className="meta horizontal">
                        <i className="pi pi-calendar" />
                        <span>Enrolled: {dayjs(stu.enrolledOn).format('M/D/YYYY')}</span>
                    </div>
                    <div className="meta horizontal">
                        <i className="pi pi-phone" />
                        <span>{stu.phone}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {['overview','courses','attendance','grades','feedback'].map(k => (
                    <button
                        key={k}
                        className={`tab ${tab===k?'active':''}`}
                        onClick={()=>setTab(k)}
                    >
                        {k[0].toUpperCase()+k.slice(1)}
                    </button>
                ))}
            </div>

            {/* === Overview === */}
            {tab==='overview' && (
                <div className="grid gap">
                    <div className="card col">
                        <div className="section-title">
                            <i className="pi pi-book" /> <span>Course Progress</span>
                        </div>
                        {Object.entries(stu.progress || {}).map(([code, pct]) => (
                            <div key={code} className="pb-row">
                                <div className="pb-head">
                                    <span className="code">{code}</span>
                                    {/* grades letter “chip” nằm bên phải */}
                                    <Tag value={letterFromPct(stu.grades?.[code])} rounded />
                                </div>
                                <ProgressBar value={pct} showValue={false} />
                                <div className="pct">{pct}% Complete</div>
                            </div>
                        ))}
                    </div>

                    <div className="card col">
                        <div className="section-title">
                            <i className="pi pi-map-marker" /> <span>Contact Information</span>
                        </div>
                        <div className="kv">
                            <div className="k">Address</div>
                            <div className="v">123 Main St, City, State 12345</div>
                        </div>
                        <div className="kv">
                            <div className="k">Emergency Contact</div>
                            <div className="v">
                                Jane Smith (Mother) <br />
                                +1 (555) 987-6543
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* === Courses === */}
            {tab==='courses' && (
                <div className="card">
                    <div className="section-title big">Enrolled Courses</div>
                    {Object.entries(stu.progress || {}).map(([code, pct]) => (
                        <div key={code} className="course-row">
                            <div className="course-title">
                                <div className="name">{courseName(code)}</div>
                                <div className="code">{code}</div>
                            </div>
                            <div className="right-badge">
                                <Tag value={letterFromPct(stu.grades?.[code])} rounded />
                            </div>
                            <ProgressBar value={pct} showValue={false} />
                            <div className="pct">{pct}% Complete</div>
                        </div>
                    ))}
                </div>
            )}

            {/* === Attendance === */}
            {tab==='attendance' && (
                <div className="card">
                    <div className="section-title row">
                        <span>Attendance Records</span>
                        <Button label="Export" icon="pi pi-download" outlined onClick={exportAttendance} />
                    </div>

                    <DataTable value={stu.attendance || []} responsiveLayout="scroll">
                        <Column field="date" header="Date" body={r => dayjs(r.date).format('M/D/YYYY')} />
                        <Column field="course" header="Course" />
                        <Column field="status" header="Status" body={r => (
                            <Tag value={r.status} severity={r.status==='Present'?'success':(r.status==='Late'?'warning':'danger')} rounded />
                        )} />
                    </DataTable>
                </div>
            )}

            {/* === Grades === */}
            {tab==='grades' && (
                <div className="card">
                    <div className="section-title row">
                        <span>Grades & Reports</span>
                        <Button label="Download Transcript" icon="pi pi-download" outlined onClick={downloadTranscript} />
                    </div>
                    <DataTable value={Object.entries(stu.grades || {}).map(([k,v])=>({subject:k, ...v}))}>
                        <Column field="subject" header="Subject" />
                        <Column field="midterm" header="Midterm" body={v => formatPct(v.midterm)} />
                        <Column field="final" header="Final" body={v => formatPct(v.final)} />
                        <Column field="assignments" header="Assignments" body={v => formatPct(v.assignments)} />
                        <Column header="Total" body={v => `${Math.round((v.midterm+v.final+v.assignments)/3)}%`} />
                    </DataTable>
                </div>
            )}

            {/* === Feedback === */}
            {tab==='feedback' && (
                <div className="card">
                    <div className="section-title big"><i className="pi pi-comment" /> Teacher Feedback & Notes</div>
                    {(stu.feedback || []).map(item => (
                        <div key={item.id} className="feedback-card">
                            <div className="fb-head">
                                <div className="teacher">{item.teacher}</div>
                                <Tag value={item.sentiment} severity={item.sentiment==='positive'?'success':'warning'} rounded />
                                <div className="date">{dayjs(item.date).format('M/D/YYYY')}</div>
                            </div>
                            <div className="course">{item.course}</div>
                            <div className="note">{item.note}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// map % → grade chip
function letterFromPct(gObj) {
    if (!gObj) return '';
    const avg = Math.round((gObj.midterm + gObj.final + gObj.assignments) / 3);
    if (avg >= 93) return 'A';
    if (avg >= 90) return 'A-';
    if (avg >= 87) return 'B+';
    if (avg >= 83) return 'B';
    if (avg >= 80) return 'B-';
    if (avg >= 77) return 'C+';
    return 'C';
}
function courseName(code) {
    const map = {
        CS101: 'Introduction to Programming',
        MATH201: 'Calculus II',
        PHYS101: 'Physics I',
        STAT201: 'Statistics',
        BIO101: 'Biology I',
        CHEM101: 'General Chemistry'
    };
    return map[code] || code;
}
