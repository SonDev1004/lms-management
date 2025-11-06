// src/features/management/pages/MStudentProfile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import EditStudentDialog from '@/features/management/components/EditStudentDialog';
import { mockStudents as STUDENTS } from '@/features/management/mocks/students';

import '@/features/management/styles/student-profile.css';

/* ================= Utils ================= */
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate = (iso) => {
    if (!iso) return '--';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};
const letterFromScore = (score) => {
    if (score == null) return '';
    if (score >= 95) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    return 'D';
};
const toCSV = (rows, header) => {
    const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const body = rows
        .map((r) => {
            if (Array.isArray(r)) return r.map(esc).join(',');
            const keys = header ?? Object.keys(r);
            return keys.map((k) => esc(r[k])).join(',');
        })
        .join('\n');
    const head = header ? header.map(esc).join(',') + '\n' : '';
    return head + body;
};
const downloadCSV = (filename, text) => {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
};

/* =============== Sub Components =============== */
function Header({ student, onEdit }) {
    return (
        <div className="sp-header">
            <div className="sp-left">
                <img
                    className="sp-avatar"
                    src={student.avatar || `https://i.pravatar.cc/120?u=${student.id}`}
                    alt={student.name}
                />
                <div>
                    <div className="sp-name">{student.name}</div>
                    <div className="sp-class">{student.class}</div>

                    <span className={`sp-status sp-status-${student.status || 'active'}`}>
            {cap(student.status || 'active')}
          </span>

                    <div className="sp-email">
                        <i className="pi pi-envelope" /> {student.email}
                    </div>
                </div>
            </div>

            <div className="sp-right">
                <Button
                    label="Edit Profile"
                    icon="pi pi-pencil"
                    className="p-button-primary sp-edit"
                    onClick={onEdit}
                />
                <div className="sp-metrics">
                    <div className="sp-metric">
                        <div className="sp-metric-label">Student ID</div>
                        <div className="sp-metric-value">{student.id}</div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label">GPA</div>
                        <div className="sp-metric-value sp-metric-gpa">
                            {Number.isFinite(student.gpa) ? student.gpa.toFixed(2) : student.gpa}
                        </div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label">
                            <i className="pi pi-calendar" /> Enrolled
                        </div>
                        <div className="sp-metric-value">{fmtDate(student.enrolledOn)}</div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label">
                            <i className="pi pi-phone" />
                        </div>
                        <div className="sp-metric-value">{student.phone}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgressItem({ label, value, grade }) {
    return (
        <div className="sp-prog-item">
            <div className="sp-prog-row">
                <div className="sp-prog-label">{label}</div>
                {!!grade && <span className="sp-grade-badge">{grade}</span>}
            </div>
            <div className="sp-prog-bar">
                <div className="sp-prog-fill" style={{ width: `${value ?? 0}%` }} />
            </div>
            <div className="sp-prog-sub">{value ?? 0}% Complete</div>
        </div>
    );
}

function ContactCard() {
    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <i className="pi pi-map-marker sp-ic" /> Contact Information
            </div>
            <div className="sp-contact">
                <div className="sp-contact-block">
                    <div className="sp-contact-label">Address</div>
                    <div className="sp-contact-value">123 Main St, City, State 12345</div>
                </div>
                <div className="sp-contact-block">
                    <div className="sp-contact-label">Emergency Contact</div>
                    <div className="sp-contact-value">
                        Jane Smith (Mother)
                        <br />
                        +1 (555) 987-6543
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= Page ================= */
export default function MStudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy student từ mock và lưu vào state để phản ứng khi Edit
    const base = useMemo(() => STUDENTS.find((s) => s.id === id), [id]);
    const [stu, setStu] = useState(base);
    useEffect(() => setStu(base), [base]);

    const [tab, setTab] = useState('overview'); // overview | courses | attendance | grades | feedback
    const [openEdit, setOpenEdit] = useState(false);

    const goBack = () => {
        if (location.key !== 'default') navigate(-1);
        else navigate('/staff/student-manager');
    };

    // Chuẩn hóa danh sách môn + điểm/tiến độ
    const listCourses = useMemo(() => {
        if (!stu) return [];
        const codes = stu.courses || [];
        const items = codes.map((code) => {
            const progress = stu?.progress?.[code];
            const g = stu?.grades?.[code];
            const total =
                g?.total ??
                (g &&
                Number.isFinite(g.midterm) &&
                Number.isFinite(g.final) &&
                Number.isFinite(g.assignments)
                    ? Math.round((g.midterm + g.final + g.assignments) / 3)
                    : null);
            return { code, progress, letter: total != null ? letterFromScore(total) : '', ...g, total };
        });

        // fallback demo để có progress/letter như ảnh nếu thiếu dữ liệu
        if (!items.some((i) => i.progress != null) && codes.length) {
            const fallback = {
                CS101: { progress: 85, letter: 'A-' },
                MATH201: { progress: 72, letter: 'B+' },
                PHYS101: { progress: 90, letter: 'A' },
            };
            return codes.map((c) => ({ code: c, ...(fallback[c] || { progress: 0, letter: '' }) }));
        }
        return items;
    }, [stu]);

    if (!stu) {
        return (
            <div className="sp-page">
                <div className="sp-topbar">
                    <Button className="p-button-text" label="← Back to Students" onClick={goBack} />
                    <h1 className="sp-title">Student Profile</h1>
                </div>
                <div className="sp-card">Student not found.</div>
            </div>
        );
    }

    // Export handlers
    const exportAttendance = () => {
        const header = ['Date', 'Course', 'Status'];
        const rows =
            stu.attendance?.map((a) => ({
                Date: fmtDate(a.date),
                Course: a.course,
                Status: a.status,
            })) ?? [];
        downloadCSV(`${stu.id}_attendance.csv`, toCSV(rows, header));
    };

    const exportTranscript = () => {
        const header = ['Subject', 'Midterm', 'Final', 'Assignments', 'Total'];
        const rows = listCourses.map((c) => ({
            Subject: c.code,
            Midterm: c.midterm ?? '',
            Final: c.final ?? '',
            Assignments: c.assignments ?? '',
            Total: c.total ?? '',
        }));
        downloadCSV(`${stu.id}_transcript.csv`, toCSV(rows, header));
    };

    return (
        <div className="sp-page">
            {/* Topbar */}
            <div className="sp-topbar" style={{ marginBottom: 10 }}>
                <button className="sp-back" onClick={goBack}>
                    ← Back to Students
                </button>
                <h1 className="sp-title">Student Profile</h1>
                <div className="sp-subtitle">Detailed information for {stu.name}</div>
            </div>

            {/* Header */}
            <Header student={stu} onEdit={() => setOpenEdit(true)} />

            {/* Tabs */}
            <div className="sp-tabs">
                {['overview', 'courses', 'attendance', 'grades', 'feedback'].map((t) => (
                    <button
                        key={t}
                        className={`sp-tab ${tab === t ? 'sp-tab-active' : ''}`}
                        onClick={() => setTab(t)}
                    >
                        {cap(t)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {tab === 'overview' && (
                <div className="sp-grid">
                    <div className="sp-card">
                        <div className="sp-card-title">
                            <span><i className="pi pi-book sp-ic" /> Course Progress</span>
                        </div>
                        <div className="sp-progress-list">
                            {listCourses.map((c) => (
                                <ProgressItem
                                    key={c.code}
                                    label={c.code}
                                    value={c.progress ?? 0}
                                    grade={c.letter}
                                />
                            ))}
                        </div>
                    </div>
                    <ContactCard />
                </div>
            )}

            {tab === 'courses' && (
                <div className="sp-card">
                    <div className="sp-card-title">
                        <span><i className="pi pi-book sp-ic" /> Enrolled Courses</span>
                    </div>
                    <div className="sp-progress-list">
                        {listCourses.map((c) => (
                            <div key={c.code} style={{ marginBottom: 18 }}>
                                <div className="sp-prog-row">
                                    <div className="sp-prog-label">{c.code}</div>
                                    {!!c.letter && <span className="sp-grade-badge">{c.letter}</span>}
                                </div>
                                <div className="sp-prog-bar">
                                    <div className="sp-prog-fill" style={{ width: `${c.progress ?? 0}%` }} />
                                </div>
                                <div className="sp-prog-sub">{c.progress ?? 0}% Complete</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'attendance' && (
                <div className="sp-card">
                    <div className="sp-card-title">
                        <span><i className="pi pi-calendar sp-ic" /> Attendance Records</span>
                        <Button icon="pi pi-download" label="Export" onClick={exportAttendance} />
                    </div>

                    <DataTable
                        value={stu.attendance || []}
                        className="p-datatable-sm"
                        paginator
                        rows={10}
                        emptyMessage="No attendance records"
                    >
                        <Column field="date" header="Date" body={(r) => fmtDate(r.date)} />
                        <Column field="course" header="Course" />
                        <Column
                            header="Status"
                            body={(r) => (
                                <Tag
                                    value={r.status}
                                    severity={
                                        r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'danger'
                                    }
                                />
                            )}
                        />
                    </DataTable>
                </div>
            )}

            {tab === 'grades' && (
                <div className="sp-card">
                    <div className="sp-card-title">
                        <span><i className="pi pi-trophy sp-ic" /> Grades & Reports</span>
                        <Button icon="pi pi-download" label="Download Transcript" onClick={exportTranscript} />
                    </div>

                    <DataTable
                        value={listCourses}
                        className="p-datatable-sm"
                        paginator
                        rows={10}
                        emptyMessage="No grade data"
                    >
                        <Column field="code" header="Subject" />
                        <Column field="midterm" header="Midterm" body={(r) => r.midterm ?? '--'} />
                        <Column field="final" header="Final" body={(r) => r.final ?? '--'} />
                        <Column field="assignments" header="Assignments" body={(r) => r.assignments ?? '--'} />
                        <Column field="total" header="Total" body={(r) => r.total ?? '--'} />
                    </DataTable>
                </div>
            )}

            {tab === 'feedback' && (
                <div className="sp-card">
                    <div className="sp-card-title">
                        <span><i className="pi pi-comments sp-ic" /> Teacher Feedback & Notes</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {(stu.feedback || []).map((fb) => (
                            <div
                                key={fb.id}
                                style={{
                                    border: '1px solid #e8ecf2',
                                    borderRadius: 12,
                                    padding: 16,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: 8,
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 800, marginBottom: 6 }}>
                                        {fb.teacher}{' '}
                                        <span style={{ color: '#6b7280', fontWeight: 600, marginLeft: 8 }}>
                      {fb.course}
                    </span>
                                    </div>
                                    <div style={{ color: '#1f2937' }}>{fb.note}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                    <Tag
                                        value={fb.sentiment}
                                        severity={
                                            fb.sentiment === 'positive'
                                                ? 'success'
                                                : fb.sentiment === 'improvement'
                                                    ? 'warning'
                                                    : 'info'
                                        }
                                    />
                                    <div style={{ color: '#6b7280' }}>{fmtDate(fb.date)}</div>
                                </div>
                            </div>
                        ))}
                        {(!stu.feedback || stu.feedback.length === 0) && (
                            <div style={{ color: '#6b7280' }}>No feedback</div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <EditStudentDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                student={stu}
                onSaved={(newStu) => setStu((s) => ({ ...s, ...newStu }))}
            />
        </div>
    );
}
