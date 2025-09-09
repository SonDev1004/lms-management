import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import classNames from 'classnames';
import {Avatar} from 'primereact/avatar';
import {Button} from 'primereact/button';
import {TabPanel, TabView} from 'primereact/tabview';
import {ProgressBar} from 'primereact/progressbar';
import {Dialog} from 'primereact/dialog';
import {Tooltip} from 'primereact/tooltip';
import {Card} from 'primereact/card';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FileUpload} from 'primereact/fileupload';
import {Badge} from 'primereact/badge';
import {Tag} from 'primereact/tag';
import {Toast} from 'primereact/toast';
import './CourseDetailStudent.css';
import LessonPage from '@/features/lesson/pages/LessonPage.jsx';

export default function CourseDetailStudent() {
    const {courseId, studentId} = useParams();
    const toast = useRef(null);

    const course = {
        id: courseId || 'c1',
        title: 'IELTS Intermediate',
        subject: 'IELTS',
        teacher: 'Ngô Tống Quốc',
        room: 'P101',
        schedule: 'T2-T4 18:00-20:00',
        description: 'Lớp IELTS Intermediate dành cho học viên muốn đạt 6.0-6.5. Tập trung Reading & Writing, kèm Speaking practice.',
        pdfUrl: '/files/sample-syllabus.pdf',
        lessonsCompleted: 7,
        totalLessons: 10
    };

    const [student] = useState({
        id: studentId || 'u2',
        name: 'Nguyễn Thị Y',
        avatar: 'N',
        email: 'nguyenty@example.com',
        phone: '0978xxxxxx',
        progress: 78,
        attendancePct: 92,
        enrolled: true,
        paymentStatus: 'paid',
        notes: 'Chú ý phần Writing: cấu trúc đoạn và lượng từ.'
    });

    const [assignments, setAssignments] = useState([
        {id: 'a1', title: 'Reading - Week 2', due: '2025-08-10', studentStatus: 'not_submitted'},
        {id: 'a2', title: 'Writing Task 1', due: '2025-08-05', studentStatus: 'graded', grade: 7.5},
        {id: 'a3', title: 'Listening Quiz 1', due: '2025-08-12', studentStatus: 'submitted'},
        {id: 'a4', title: 'Speaking Practice 1', due: '2025-08-15', studentStatus: 'not_submitted'},
        {id: 'a5', title: 'Grammar Quiz - Tenses', due: '2025-08-18', studentStatus: 'submitted'},
        {id: 'a6', title: 'Vocabulary Assignment - Week 3', due: '2025-08-20', studentStatus: 'graded', grade: 8.0},
        {id: 'a7', title: 'Reading Comprehension Test', due: '2025-08-22', studentStatus: 'not_submitted'},
        {id: 'a8', title: 'Essay Writing - Task 2', due: '2025-08-25', studentStatus: 'graded', grade: 6.5},
        {id: 'a9', title: 'Listening Quiz 2', due: '2025-08-27', studentStatus: 'submitted'},
        {id: 'a10', title: 'Speaking Mock Test', due: '2025-08-30', studentStatus: 'not_submitted'},
        {id: 'a11', title: 'Final Writing Exam', due: '2025-09-02', studentStatus: 'graded', grade: 7.0},
        {id: 'a12', title: 'Midterm Reading Exam', due: '2025-09-05', studentStatus: 'not_submitted'},
        {id: 'a13', title: 'Listening Dictation', due: '2025-09-07', studentStatus: 'submitted'}
    ]);

    const [gradeDialog, setGradeDialog] = useState({visible: false, assignment: null});

    const [attendanceHistory] = useState([
        {session: 1, date: '2025-06-01', present: true},
        {session: 2, date: '2025-06-03', present: true},
        {session: 3, date: '2025-06-07', present: false},
        {session: 4, date: '2025-06-10', present: true},
        {session: 5, date: '2025-06-12', present: true},
        {session: 6, date: '2025-06-14', present: false},
        {session: 7, date: '2025-06-17', present: true},
        {session: 8, date: '2025-06-20', present: true},
        {session: 9, date: '2025-06-22', present: false},
        {session: 10, date: '2025-06-25', present: true},
        {session: 11, date: '2025-06-27', present: true},
        {session: 12, date: '2025-06-29', present: true},
        {session: 13, date: '2025-07-01', present: false}
    ]);

    const [activities] = useState([
        {id: 'act1', date: new Date(Date.now() - 2 * 60 * 60 * 1000), text: 'GV đã tải lên: LessonView 02 - Reading'},
        {id: 'act2', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), text: 'GV đã bình luận: Writing Task 1'},
        {id: 'act3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), text: 'GV đã chấm điểm: Listening Quiz 1'},
        {id: 'act4', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), text: 'GV đã thêm: LessonView 03 - Vocabulary'},
        {id: 'act5', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Writing Task 2'},
        {id: 'act6', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), text: 'GV đã đăng: Pronunciation Audio'},
        {id: 'act7', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Grammar Quiz - Tenses'},
        {id: 'act8', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), text: 'GV đã bình luận: Essay Writing'},
        {id: 'act9', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), text: 'GV đã thêm: LessonView 05 - Listening'},
        {id: 'act10', date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), text: 'HS đã tham gia Speaking Mock Test'},
        {
            id: 'act11',
            date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
            text: 'GV đã tải lên: Reading Comprehension Test'
        },
        {
            id: 'act12',
            date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            text: 'GV đã chấm điểm: Vocabulary Assignment'
        },
        {id: 'act13', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Listening Dictation'}
    ]);


    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        let raf;
        const start = performance.now();
        const from = 0;
        const to = student.progress;
        const duration = 900;
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            setAnimatedProgress(Math.round(from + (to - from) * eased));
            if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [student.progress]);



    const onUploadHandler = (event, assignmentId) => {
        const file = event.files && event.files[0];
        if (!file) return;
        const a = assignments.find((x) => x.id === assignmentId);
        if (!a) return;
        toast.current && toast.current.show({severity: 'info', summary: 'Đang tải lên', detail: file.name, life: 1200});
        setTimeout(() => {
            setAssignments((prev) => prev.map((it) => (it.id === assignmentId ? {
                ...it,
                studentStatus: 'submitted'
            } : it)));
            toast.current && toast.current.show({
                severity: 'success',
                summary: 'Nộp bài thành công',
                detail: a.title + ' đã nộp',
                life: 1600
            });
        }, 900);
    };

    const formatDate = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatFullDateTime = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        const hh = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} • ${hh}:${mm}`;
    };

    const daysDiff = (d) => {
        if (!d) return null;
        const now = new Date();
        const due = new Date(d);
        const diffMs = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.ceil(diffMs / msPerDay);
    };

    const getAssignmentStatus = (a) => {
        if (a.studentStatus === 'graded') return {kind: 'graded', label: `Điểm ${a.grade}`, variant: 'success'};
        if (a.studentStatus === 'submitted') return {kind: 'submitted', label: 'Đã nộp', variant: 'info'};
        const diff = daysDiff(a.due);
        if (diff == null) return {kind: 'pending', label: 'Chưa nộp', variant: 'neutral'};
        if (diff < 0) return {kind: 'overdue', label: `Quá hạn ${Math.abs(diff)} ngày`, variant: 'danger'};
        if (diff <= 3) return {kind: 'due_soon', label: `Còn ${diff} ngày`, variant: 'warning'};
        return {kind: 'pending', label: 'Chưa nộp', variant: 'neutral'};
    };

    const filteredAssignments = assignments.filter((a) => {
        if (assignmentFilter === 'all') return true;
        const s = getAssignmentStatus(a);
        if (assignmentFilter === 'overdue') return s.kind === 'overdue';
        if (assignmentFilter === 'due_soon') return s.kind === 'due_soon';
        if (assignmentFilter === 'not_submitted') return s.kind === 'pending';
        if (assignmentFilter === 'submitted') return s.kind === 'submitted';
        if (assignmentFilter === 'graded') return s.kind === 'graded';
        return true;
    });

    const assignmentStatusBody = (row) => {
        const s = getAssignmentStatus(row);
        const severity = s.variant === 'danger' ? 'danger' : s.variant === 'success' ? 'success' : s.variant === 'info' ? 'info' : undefined;
        return <Tag value={s.label} severity={severity} className="p-mr-2 p-py-2"/>;
    };

    const assignmentIcon = (a) => {
        const t = (a.subject || a.title || '').toLowerCase();
        if (t.includes('reading')) return '📘';
        if (t.includes('writing') || t.includes('essay')) return '✍️';
        if (t.includes('listening')) return '🎧';
        if (t.includes('speaking')) return '🎤';
        if (t.includes('grammar')) return '📝';
        if (t.includes('vocab') || t.includes('vocabulary')) return '📚';
        return '📄';
    };

    function isRecent(d) {
        return Date.now() - new Date(d).getTime() < 48 * 60 * 60 * 1000;
    }

    function timeAgo(d) {
        const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
        if (diff < 60) return `${diff}s trước`;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    }



    return (
        <div className="cd-root p-p-4">
            <Toast ref={toast}/>
            <Card className="cd-header p-d-flex p-ai-center p-p-4">
                <div className="p-d-flex p-ai-center p-jc-start cd-header-left" style={{gap: 16}}>
                    <Avatar label={course.title.charAt(0)} size="xlarge" shape="square" className="cd-avatar"
                            aria-hidden="true"/>
                    <div className="cd-course-meta">
                        <h2 className="cd-course-title">🎓 {course.title}</h2>
                        <div className="p-d-flex p-flex-wrap cd-pills">
                            <Tag icon="pi pi-user" className="cd-pill pill-teacher" value={`GV: ${course.teacher}`}/>
                            <Tag icon="pi pi-map-marker" className="cd-pill pill-room" value={`Phòng: ${course.room}`}/>
                            <Tag icon="pi pi-calendar" className="cd-pill pill-schedule" value={course.schedule}/>
                            <Tag className="cd-pill tag-subject" value={course.subject}/>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="p-grid cd-layout">
                <main className="p-col-12 p-md-8 cd-main">
                    <div className="tabs-row">
                        <TabView>
                            <TabPanel header={<span className="tab-header">📘<span
                                className="tab-title">Giáo trình</span></span>}>
                                <LessonPage />
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">📝<span
                                className="tab-title">Bài tập</span></span>}>
                                <div className="p-d-flex p-ai-center p-mb-2 p-flex-wrap" style={{gap: 12}}>
                                    <div className="small-muted">Bộ lọc:</div>
                                    {['all', 'due_soon', 'overdue', 'not_submitted', 'submitted', 'graded'].map((k) => (
                                        <Button
                                            key={k}
                                            className={classNames('assign-filter-btn', {'p-button-text': assignmentFilter !== k})}
                                            onClick={() => setAssignmentFilter(k)}
                                            label={
                                                k === 'all' ? 'Tất cả' :
                                                    k === 'due_soon' ? 'Sắp hết hạn' :
                                                        k === 'overdue' ? 'Quá hạn' :
                                                            k === 'not_submitted' ? 'Chưa nộp' :
                                                                k === 'submitted' ? 'Đã nộp' : 'Đã chấm'
                                            }
                                        />
                                    ))}
                                </div>

                                <div className="assignments-table p-mt-2">
                                    <ul className="assignments-list" role="list">
                                        {filteredAssignments.map((row) => {
                                            const s = getAssignmentStatus(row);
                                            const diff = daysDiff(row.due);
                                            const overdue = diff != null && diff < 0;
                                            return (
                                                <li key={row.id}
                                                    className={classNames('assignment-row', {overdue: overdue})}
                                                    tabIndex={0} aria-label={`Bài tập ${row.title}`}>
                                                    <div className="ar-col ar-col--title">
                                                        <div className="assign-title">
                                                            <span className="assign-icon"
                                                                  aria-hidden>{assignmentIcon(row)}</span>
                                                            <span className="assign-title-text">{row.title}</span>
                                                        </div>
                                                        <div
                                                            className="assign-sub small-muted">{row.subject || ''}</div>
                                                    </div>

                                                    <div className="ar-col ar-col--due">
                                                        <div className="due-date">{formatDate(row.due)}</div>
                                                        <div className="due-meta small-muted">
                                                            {(() => {
                                                                if (diff == null) return '';
                                                                if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`;
                                                                if (diff === 0) return 'Hôm nay';
                                                                return `Còn ${diff} ngày`;
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="ar-col ar-col--status">
                                                        {assignmentStatusBody(row)}
                                                    </div>
                                                    <div className="ar-col ar-col--action">
                                                        {(s.kind === 'pending' || s.kind === 'due_soon' || s.kind === 'overdue') && (
                                                            <div className="action-upload">
                                                                <FileUpload
                                                                    mode="basic"
                                                                    name="file"
                                                                    customUpload
                                                                    accept=".pdf,.doc,.docx"
                                                                    maxFileSize={20 * 1024 * 1024}
                                                                    chooseLabel="Nộp"
                                                                    uploadHandler={(e) => onUploadHandler(e, row.id)}
                                                                    multiple={false}
                                                                    auto={true}
                                                                    className="btn-upload"
                                                                />
                                                            </div>
                                                        )}

                                                        {s.kind === 'submitted' && (
                                                            <Button label="Đã nộp" icon="pi pi-check" disabled
                                                                    className="btn-submitted"/>
                                                        )}

                                                        {s.kind === 'graded' && (
                                                            <Button className="p-button-text btn-view-grade"
                                                                    label={`Xem điểm ${row.grade}`}
                                                                    onClick={() => setGradeDialog({
                                                                        visible: true,
                                                                        assignment: row
                                                                    })}/>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                        {filteredAssignments.length === 0 &&
                                            <li className="assign-empty small-muted">Không có bài tập phù hợp bộ
                                                lọc.</li>}
                                    </ul>
                                </div>
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🗓️<span className="tab-title">Lịch sử điểm danh</span></span>}>
                                <div className="attendance-summary p-mt-2">
                                    <div className="p-mb-3 p-text-bold">Có
                                        mặt: {attendanceHistory.filter(a => a.present).length} •
                                        Vắng: {attendanceHistory.filter(a => !a.present).length} • Điểm
                                        danh: {student.attendancePct}%
                                    </div>
                                    <Card>
                                        <DataTable value={attendanceHistory} responsiveLayout="scroll"
                                                   className="p-mt-2">
                                            <Column field="session" header="Buổi"/>
                                            <Column field="date" header="Ngày" body={(row) => formatDate(row.date)}/>
                                            <Column
                                                body={(row) => row.present ? <Tag value="Có mặt" severity="success"/> :
                                                    <Tag value="Vắng" severity="danger"/>} header="Trạng thái"/>
                                        </DataTable>
                                    </Card>
                                </div>
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🔥<span className="tab-title">Hoạt động</span></span>}>
                                <div className="activity-list p-mt-2">
                                    {activities.map((a) => (
                                        <Card key={a.id}
                                              className={classNames('activity-item', {recent: isRecent(a.date)})}>
                                            <div className="p-d-flex p-ai-start p-jc-between">
                                                <div style={{width: 64}}>
                                                    {isRecent(a.date) ? <Badge value="Mới" severity="success"
                                                                               className="activity-badge"/> :
                                                        <div className="activity-spacer"/>}
                                                </div>
                                                <div className="activity-content" style={{flex: 1}}>
                                                    <div className="activity-top p-d-flex p-jc-between p-ai-start">
                                                        <div className="activity-text"><strong
                                                            className="activity-title">{a.text}</strong></div>
                                                        <div
                                                            className="activity-time small-muted">{formatFullDateTime(a.date)}
                                                            <span style={{
                                                                marginLeft: 8,
                                                                fontSize: 12,
                                                                color: '#94a3b8'
                                                            }}>({timeAgo(a.date)})</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </main>

                <aside className="p-col-12 p-md-4 cd-sidebar">
                    <Card className="side-card p-shadow-3">
                        <div className="side-row p-d-flex p-jc-between p-ai-center">
                            <div className="small-muted">Tiến độ khóa</div>
                            <div className="strong">{student.progress}%</div>
                        </div>

                        <div className="cd-progress-wrap p-mt-3">
                            <ProgressBar value={animatedProgress} showValue={false} className="cd-progress"/>
                            <div className="cd-progress-meta">
                                <div>{animatedProgress}% hoàn thành</div>
                                <div className="small-muted">{course.lessonsCompleted}/{course.totalLessons} buổi</div>
                            </div>
                        </div>

                        <div className="side-row p-d-flex p-jc-between p-ai-center p-mt-3">
                            <div className="small-muted">Tỷ lệ điểm danh</div>
                            <div className="strong">{student.attendancePct}%</div>
                        </div>

                        <div className="side-row p-d-flex p-jc-between p-ai-center p-mt-2">
                            <div className="small-muted">Thanh toán</div>
                            <div className="strong">{student.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa'}</div>
                        </div>

                        <div className="student-quickinfo p-mt-3">
                            <div className="qi-row p-d-flex p-jc-between p-ai-center">
                                <div className="qi-label">📅 <strong>Buổi tiếp theo</strong></div>
                                <div className="qi-value">
                                    <div className="qi-date">{formatFullDateTime('2025-08-12T18:00:00')}</div>
                                    <div className="qi-topic">Lesson 08 - Writing Task 2</div>
                                </div>
                            </div>

                            <div className="qi-row p-d-flex p-jc-between p-ai-center p-mt-2">
                                <div className="qi-label">📚 <strong>Bài còn lại</strong></div>
                                <div className="qi-value">{course.totalLessons - course.lessonsCompleted} buổi</div>
                            </div>

                        </div>
                    </Card>
                </aside>
            </div>

            {/*<Dialog*/}
            {/*    header={selectedSyllabus?.title || 'Chi tiết tuần'}*/}
            {/*    visible={syllabusVisible}*/}
            {/*    className="syllabus-modal"*/}
            {/*    style={{width: isMobile ? '95vw' : '80vw', maxWidth: '1100px'}}*/}
            {/*    modal*/}
            {/*    onHide={() => {*/}
            {/*        setSyllabusVisible(false);*/}
            {/*        setSelectedSyllabus(null);*/}
            {/*    }}*/}
            {/*    breakpoints={{'960px': '95vw'}}*/}
            {/*>*/}
            {/*    {selectedSyllabus ? (*/}
            {/*        <div className="syllabus-modal-grid">*/}
            {/*            <div>*/}
            {/*                <div className="syllabus-modal-header">*/}
            {/*                    <h3 className="syllabus-modal-title">{selectedSyllabus.title}</h3>*/}
            {/*                    <div className="syllabus-modal-sub">*/}
            {/*                        <div className="syllabus-shortdesc">{selectedSyllabus.desc}</div>*/}
            {/*                        <div style={{*/}
            {/*                            marginLeft: '6px',*/}
            {/*                            color: '#94a3b8'*/}
            {/*                        }}>📅 {formatDate(selectedSyllabus.publishedAt)} {selectedSyllabus.updatedAt ? `• Cập nhật ${formatDate(selectedSyllabus.updatedAt)}` : ''}</div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <ul className="syllabus-bullets">*/}
            {/*                    {splitContentToBullets(selectedSyllabus.content).map((x, i) => <li key={i}>{x}</li>)}*/}
            {/*                </ul>*/}

            {/*                <div className="syllabus-detail">*/}
            {/*                    <div className="syllabus-grid">*/}
            {/*                        <div>*/}
            {/*                            <h6>🎯 Mục tiêu</h6>*/}
            {/*                            <ul>{selectedSyllabus.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>*/}
            {/*                        </div>*/}
            {/*                        <div>*/}
            {/*                            <h6>📝 Hoạt động</h6>*/}
            {/*                            <ul>{selectedSyllabus.activities.map((a, i) => <li key={i}>{a}</li>)}</ul>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    <h5>Tài liệu</h5>*/}
            {/*                    <div className="syllabus-docs">*/}
            {/*                        {selectedSyllabus.activeDoc ? (*/}
            {/*                            <div className="doc-preview">*/}
            {/*                                {renderDocPreview(selectedSyllabus.activeDoc)}*/}
            {/*                            </div>*/}
            {/*                        ) : (*/}
            {/*                            <>*/}
            {/*                                <h5>Tài liệu</h5>*/}
            {/*                                <div className="syllabus-docs">*/}
            {/*                                    {selectedSyllabus.documents?.map(doc => (*/}
            {/*                                        <div key={doc.id} className="doc-card"*/}
            {/*                                             onClick={() => openDocPreview(selectedSyllabus, doc)}>*/}
            {/*                                            <div className={`doc-icon`}*/}
            {/*                                                 aria-hidden>{doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : '🔉'}</div>*/}
            {/*                                            <div className="doc-text">{doc.name}</div>*/}
            {/*                                        </div>*/}
            {/*                                    ))}*/}
            {/*                                </div>*/}
            {/*                            </>*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            <aside className="syllabus-quickinfo">*/}
            {/*                <div className="qi-row">*/}
            {/*                    <div className="qi-label">Chủ đề</div>*/}
            {/*                    <div className="qi-value">{selectedSyllabus.subject}</div>*/}
            {/*                </div>*/}
            {/*                <div className="qi-row">*/}
            {/*                    <div className="qi-label">GV</div>*/}
            {/*                    <div className="qi-value">{selectedSyllabus.teacher}</div>*/}
            {/*                </div>*/}
            {/*                <div className="qi-row">*/}
            {/*                    <div className="qi-label">Phát hành</div>*/}
            {/*                    <div className="qi-value">{formatDate(selectedSyllabus.publishedAt)}</div>*/}
            {/*                </div>*/}
            {/*                {selectedSyllabus.updatedAt && <div className="qi-row">*/}
            {/*                    <div className="qi-label">Cập nhật</div>*/}
            {/*                    <div className="qi-value">{formatDate(selectedSyllabus.updatedAt)}</div>*/}
            {/*                </div>}*/}
            {/*            </aside>*/}
            {/*        </div>*/}
            {/*    ) : <p>Không có dữ liệu.</p>}*/}
            {/*</Dialog>*/}


            <Dialog header={`Điểm: ${gradeDialog.assignment?.title || ''}`} visible={gradeDialog.visible} modal
                    onHide={() => setGradeDialog({visible: false, assignment: null})}>
                {gradeDialog.assignment ? (
                    <div>
                        <p>Bài: <strong>{gradeDialog.assignment.title}</strong></p>
                        <p>Điểm: <strong>{gradeDialog.assignment.grade}</strong></p>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button label="Đóng" className="p-button-text"
                                    onClick={() => setGradeDialog({visible: false, assignment: null})}/>
                        </div>
                    </div>
                ) : <p>Không có dữ liệu</p>}
            </Dialog>
        </div>
    );
}