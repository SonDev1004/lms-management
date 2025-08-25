import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import './UserProfile.css';

// npm install chart.js
const sampleStudent = {
    studentId: 'STU-2024-098',
    name: 'Lê Thị B',
    username: 'lethib',
    className: 'Toeic Basic - T2/T4 18:00',
    level: 'A2 (Elementary)',
    tutor: 'Mr. Trần Minh',
    location: 'Hà Nội, Việt Nam',
    email: 'lethib@example.com',
    phone: '+84 98 765 4321',
    enrolled: '2024-09-01T00:00:00.000Z',
    bio: 'Học viên chuyên luyện TOEIC, thích luyện nghe mỗi ngày và tham gia speaking club.',
    skills: ['Speaking', 'Listening', 'Reading', 'Writing'],
    progress: { Speaking: 72, Listening: 80, Reading: 65, Writing: 58 },
    attendanceRate: 92,
    nextLesson: '2025-08-26T18:00:00.000Z',
    outstandingFee: 0,
    goals: 'Nâng điểm TOEIC lên 600 trong 6 tháng, cải thiện Speaking để tự tin phỏng vấn.',
    lastTest: {
        name: 'Placement Test',
        date: '2025-07-30T09:00:00.000Z',
        overall: 470,
        breakdown: { Listening: 250, Reading: 220 }
    },
    skillHistory: {
        labels: ['May', 'Jun', 'Jul', 'Aug'],
        Speaking: [60, 66, 70, 72],
        Listening: [70, 75, 78, 80],
        Reading: [55, 60, 63, 65],
        Writing: [50, 54, 56, 58]
    }
};

const activity = [
    { id: 1, status: 'lesson', date: '2025-08-20T10:00:00.000Z', actor: 'Tutor - Trần Minh', content: 'Attended Lesson: Unit 8 - Listening practice' },
    { id: 2, status: 'test', date: '2025-07-30T09:00:00.000Z', actor: 'Center', content: 'Placement Test: Overall 470 (Listening 250 / Reading 220)' },
    { id: 3, status: 'payment', date: '2025-06-10T14:00:00.000Z', actor: 'Admin', content: 'Paid course fee for Sep–Nov 2025' }
];

//chuyển thể ngày
const formatDate = (isoOrString) => {
    if (!isoOrString) return '';
    const d = new Date(isoOrString);
    if (isNaN(d)) return isoOrString;
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
};
//nhận giờ
const formatTime = (isoOrString) => {
    if (!isoOrString) return '';
    const d = new Date(isoOrString);
    if (isNaN(d)) return isoOrString;
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
};

const statusColor = { lesson: '#0ea5e9', test: '#10b981', payment: '#f59e0b', default: '#9ca3af' };
const statusIcon = { lesson: 'pi-book', test: 'pi-chart-line', payment: 'pi-wallet' };
const statusSeverity = { lesson: 'info', test: 'success', payment: 'warning', default: 'info' };

// validation
const isValidEmail = (s) => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const digitsCount = (s) => (s ? s.replace(/\D/g, '').length : 0);
const isValidPhone = (s) => digitsCount(s) >= 9;

//profile trên
const ProfileSidebar = React.memo(function ProfileSidebar({ student }) {
    const initials = (student.name || '').split(' ').map(n => (n || '')[0] || '').slice(0,2).join('').toUpperCase();

    return (
        <aside className="profile-side">
            <Card className="side-card">
                <div className="avatar-row">
                    <div className="avatar-wrap">
                        <Avatar label={initials} shape="circle" className="avatar-main" />
                    </div>

                    <div className="user-meta">
                        <h2 className="user-name">{student.name}</h2>
                        <div className="user-sub">ID: <strong>{student.studentId}</strong></div>
                        <div className="user-role">Class: {student.className}</div>

                        <div className="user-location">
                            <i className="pi pi-user-tie tutor-icon" aria-hidden="true" />
                            <strong className="tutor-label">Tutor:</strong>
                            <span className="tutor-name">{student.tutor}</span>
                        </div>

                        <div className="user-level">
                            <span className="level-badge"><i className="pi pi-star level-icon" /> {student.level}</span>
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="profile-stats">
                    <div className="stat-row attendance-row">
                        <div>
                            <small className="stat-label">Attendance</small>
                        </div>
                        <div className="stat-bar">
                            <ProgressBar value={student.attendanceRate} showValue={true} />
                        </div>
                    </div>

                    <div className="stat-row nextlesson-row">
                        <div>
                            <small className="stat-label">Next lesson</small>
                            <div className="next-lesson">
                                <i className="pi pi-calendar next-lesson-icon" aria-hidden="true" />
                                <span className="next-lesson-text">{formatDate(student.nextLesson)} — {formatTime(student.nextLesson)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </aside>
    );
});

//skill pc
const RadarChart = React.memo(function RadarChart({ student }) {
    const radarData = useMemo(() => ({
        labels: student.skills,
        datasets: [{
            label: 'Current progress',
            data: student.skills.map(s => student.progress[s]),
            fill: true,
            backgroundColor: 'rgba(14,165,233,0.18)',
            borderColor: '#0ea5e9',
            pointBackgroundColor: '#0ea5e9'
        }]
    }), [student]);

    const radarOptions = useMemo(() => ({
        scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, color: '#374151' }, grid: { color: 'rgba(0,0,0,0.06)' }, pointLabels: { color: '#374151' } } },
        plugins: { legend: { position: 'bottom' } },
        maintainAspectRatio: false
    }), []);

    return <Chart type="radar" data={radarData} options={radarOptions} style={{ height: '320px' }} />;
});
//trend pc
const TrendChart = React.memo(function TrendChart({ student }) {
    const trendData = useMemo(() => ({
        labels: student.skillHistory.labels,
        datasets: [
            { label: 'Speaking', data: student.skillHistory.Speaking, fill: false, tension: 0.3, borderColor: '#0ea5e9', backgroundColor: '#0ea5e9' },
            { label: 'Listening', data: student.skillHistory.Listening, fill: false, tension: 0.3, borderColor: '#06b6d4', backgroundColor: '#06b6d4' },
            { label: 'Reading', data: student.skillHistory.Reading, fill: false, tension: 0.3, borderColor: '#f59e0b', backgroundColor: '#f59e0b' },
            { label: 'Writing', data: student.skillHistory.Writing, fill: false, tension: 0.3, borderColor: '#10b981', backgroundColor: '#10b981' }
        ]
    }), [student]);

    const trendOptions = useMemo(() => ({ plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } }, maintainAspectRatio: false }), []);

    return <Chart type="line" data={trendData} options={trendOptions} style={{ height: '320px' }} />;
});

//user
export default function UserProfile() {
    const [student, setStudent] = useState(sampleStudent);

    const [form, setForm] = useState({
        email: sampleStudent.email,
        phone: sampleStudent.phone,
        className: sampleStudent.className,
        tutor: sampleStudent.tutor,
        sms: true,
        enrolled: sampleStudent.enrolled,
        location: sampleStudent.location
    });

    const [editingField, setEditingField] = useState(null);
    const [testDialogVisible, setTestDialogVisible] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const toast = useRef(null);

    const activities = useMemo(() => activity, []);
//thả chế độ edit
    const beginInlineEdit = (field) => {
        setForm(f => ({ ...f,
            email: student.email,
            phone: student.phone,
            enrolled: student.enrolled,
            location: student.location,
            className: student.className,
            tutor: student.tutor
        }));
        setEditingField(field);
    };
//bỏ edit
    const cancelInlineEdit = (field) => {
        setForm(f => ({ ...f, [field]: student[field] ?? f[field] }));
        setEditingField(null);
    };
//test
    const openTestDetails = useCallback((item) => {
        if (item && item.status === 'test') {
            setSelectedTest(item);
            setTestDialogVisible(true);
        }
    }, []);
//nhật kí
    const activityItemTemplate = useCallback((a) => {
        const color = statusColor[a.status] || statusColor.default;
        const icon = statusIcon[a.status] || 'pi-file';
        const severity = statusSeverity[a.status] || 'info';

        return (
            <div className="activity-row" key={a.id} onClick={() => a.status === 'test' && openTestDetails(a)} role={a.status === 'test' ? 'button' : undefined} tabIndex={a.status === 'test' ? 0 : -1}>
                <div className="row-left">
                    <Avatar icon={`pi ${icon}`} size="large" shape="circle" style={{ background: color, color: '#fff' }} />
                </div>
                <div className="row-body">
                    <div className="activity-title">
                        {a.content} <small className="p-text-secondary">• {formatDate(a.date)} • {formatTime(a.date)}</small>
                        <span className="activity-tag"><Tag value={a.status} severity={severity} className="p-ml-2" /></span>
                    </div>
                    <div className="activity-content">By: {a.actor}</div>
                </div>
            </div>
        );
    }, [openTestDetails]);

    return (
        <div className="user-profile-root">
            <Toast ref={toast} />

            <div className="profile-grid p-d-flex">
                <ProfileSidebar student={student} />

                <main className="profile-main">
                    <Card className="main-card">
                        <TabView>
                            <TabPanel header="Overview">
                                <div className="overview-grid">
                                    <section className="overview-left">
                                        <p className="user-bio">{student.bio}</p>

                                        <div className="info-grid">
                                            {/*email*/}
                                            <div className="info-item">
                                                <small>Email</small>
                                                <div className="field-row">
                                                    <div className="value email-value">
                                                        {editingField === 'email' ? (
                                                            <InputText value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} aria-label="Edit email" />
                                                        ) : (
                                                            <div className="email-text"><i className="pi pi-envelope p-mr-2" aria-hidden="true"></i>{student.email}</div>
                                                        )}
                                                    </div>

                                                    <div className="actions">
                                                        {editingField === 'email' ? (
                                                            <>
                                                                <Button icon="pi pi-check" className="p-button-text edit-field-btn" onClick={() => {
                                                                    if (!isValidEmail(form.email)) { toast.current.show({ severity: 'error', summary: 'Invalid email', detail: 'Please enter a valid email', life: 3000 }); return; }
                                                                    setStudent(prev => ({ ...prev, email: form.email }));
                                                                    setEditingField(null);
                                                                    toast.current.show({ severity: 'success', summary: 'Saved', detail: 'Email updated', life: 2000 });
                                                                }} aria-label="Save email" />
                                                                <Button icon="pi pi-times" className="p-button-text edit-field-btn" onClick={() => cancelInlineEdit('email')} aria-label="Cancel edit email" />
                                                            </>
                                                        ) : (
                                                            <Button icon="pi pi-pencil" className="p-button-text edit-field-btn" onClick={() => beginInlineEdit('email')} aria-label="Edit email" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/*phone*/}
                                            <div className="info-item">
                                                <small>Phone</small>
                                                <div className="field-row">
                                                    <div className="value">
                                                        {editingField === 'phone' ? (
                                                            <InputText value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} aria-label="Edit phone" />
                                                        ) : (
                                                            <div><i className="pi pi-phone p-mr-2" aria-hidden="true"></i>{student.phone}</div>
                                                        )}
                                                    </div>

                                                    <div className="actions">
                                                        {editingField === 'phone' ? (
                                                            <>
                                                                <Button icon="pi pi-check" className="p-button-text edit-field-btn" onClick={() => {
                                                                    if (!isValidPhone(form.phone)) { toast.current.show({ severity: 'error', summary: 'Invalid phone', detail: 'Please enter a valid phone', life: 3000 }); return; }
                                                                    setStudent(prev => ({ ...prev, phone: form.phone }));
                                                                    setEditingField(null);
                                                                    toast.current.show({ severity: 'success', summary: 'Saved', detail: 'Phone updated', life: 2000 });
                                                                }} aria-label="Save phone" />
                                                                <Button icon="pi pi-times" className="p-button-text edit-field-btn" onClick={() => cancelInlineEdit('phone')} aria-label="Cancel edit phone" />
                                                            </>
                                                        ) : (
                                                            <Button icon="pi pi-pencil" className="p-button-text edit-field-btn" onClick={() => beginInlineEdit('phone')} aria-label="Edit phone" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/*enrolled*/}

                                            <div className="info-item">
                                                <small>Enrolled</small>
                                                <div className="field-row">
                                                    <div className="value">
                                                        {editingField === 'enrolled' ? (
                                                            <Calendar value={form.enrolled ? new Date(form.enrolled) : null} onChange={(e) => setForm(f => ({ ...f, enrolled: e.value ? e.value.toISOString() : null }))} showIcon dateFormat="dd/mm/yy" />
                                                        ) : (
                                                            <div>{formatDate(student.enrolled)}</div>
                                                        )}
                                                    </div>

                                                    <div className="actions">
                                                        {editingField === 'enrolled' ? (
                                                            <>
                                                                <Button icon="pi pi-check" className="p-button-text edit-field-btn" onClick={() => {
                                                                    setStudent(prev => ({ ...prev, enrolled: form.enrolled }));
                                                                    setEditingField(null);
                                                                    toast.current.show({ severity: 'success', summary: 'Saved', detail: 'Enrolled date updated', life: 2000 });
                                                                }} aria-label="Save enrolled" />
                                                                <Button icon="pi pi-times" className="p-button-text edit-field-btn" onClick={() => cancelInlineEdit('enrolled')} aria-label="Cancel edit enrolled" />
                                                            </>
                                                        ) : (
                                                            <Button icon="pi pi-pencil" className="p-button-text edit-field-btn" onClick={() => beginInlineEdit('enrolled')} aria-label="Edit enrolled" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/*location*/}

                                            <div className="info-item">
                                                <small>Location</small>
                                                <div className="field-row">
                                                    <div className="value">
                                                        {editingField === 'location' ? (
                                                            <InputText value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} aria-label="Edit location" />
                                                        ) : (
                                                            <div>{student.location}</div>
                                                        )}
                                                    </div>

                                                    <div className="actions">
                                                        {editingField === 'location' ? (
                                                            <>
                                                                <Button icon="pi pi-check" className="p-button-text edit-field-btn" onClick={() => { setStudent(prev => ({ ...prev, location: form.location })); setEditingField(null); toast.current.show({ severity: 'success', summary: 'Saved', detail: 'Location updated', life: 2000 }); }} aria-label="Save location" />
                                                                <Button icon="pi pi-times" className="p-button-text edit-field-btn" onClick={() => cancelInlineEdit('location')} aria-label="Cancel edit location" />
                                                            </>
                                                        ) : (
                                                            <Button icon="pi pi-pencil" className="p-button-text edit-field-btn" onClick={() => beginInlineEdit('location')} aria-label="Edit location" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Divider />

                                        <h4>Mục tiêu & Trạng thái</h4>
                                        <div className="goals">{student.goals}</div>

                                        <div className="p-mt-3">
                                            <small>Last test</small>
                                            <div className="last-test">
                                                <div>{student.lastTest.name} • {formatDate(student.lastTest.date)}</div>
                                                <div className="p-text-secondary">Overall: {student.lastTest.overall}</div>
                                                <Button label="Xem chi tiết" onClick={() => { setSelectedTest({ ...student.lastTest, status: 'test' }); setTestDialogVisible(true); }} className="p-button-text p-ml-2" icon="pi pi-eye" aria-label="View last test" />
                                            </div>
                                        </div>

                                        <Divider />

                                        <h4>Skill Progress (radar)</h4>
                                        <div className="chart-radar"><RadarChart student={student} /></div>

                                        <Divider />

                                        <h4>Trend (last months)</h4>
                                        <div className="chart-trend"><TrendChart student={student} /></div>

                                    </section>
                                </div>
                            </TabPanel>

                            <TabPanel header="Attendance & Tests">
                                <h3>Attendance & Test History</h3>
                                <div className="p-mt-3">
                                    <DataView value={activities} layout="list" itemTemplate={activityItemTemplate} />
                                </div>
                            </TabPanel>
                        </TabView>
                    </Card>
                </main>
            </div>

            <Dialog header={selectedTest ? selectedTest.name : 'Test details'} visible={testDialogVisible} style={{ width: '480px' }} modal onHide={() => setTestDialogVisible(false)}>
                {selectedTest ? (
                    <div>
                        <p><strong>Date:</strong> {formatDate(selectedTest.date)} • {formatTime(selectedTest.date)}</p>
                        <p><strong>Overall:</strong> {selectedTest.overall}</p>
                        {selectedTest.breakdown && (
                            <div>
                                <h5>Breakdown</h5>
                                <DataTable value={Object.entries(selectedTest.breakdown).map(([k,v]) => ({ section: k, score: v }))} showGridlines={false} className="p-mt-2">
                                    <Column field="section" header="Section" body={(row) => <strong>{row.section}</strong>} />
                                    <Column field="score" header="Score" />
                                </DataTable>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No test selected</p>
                )}
            </Dialog>
        </div>
    );
}

