import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import './CourseDetailStudent.css';

export default function CourseDetailStudent() {
    const { courseId, studentId } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    //data course
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
        totalLessons: 9
    };
    //data học viên
    const [student, setStudent] = useState({
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
    //data bài tập
    const [assignments, setAssignments] = useState([
        { id: 'a1', title: 'Reading - Week 2', due: '2025-08-10', studentStatus: 'not_submitted' },
        { id: 'a2', title: 'Writing Task 1', due: '2025-08-05', studentStatus: 'graded', grade: 7.5 },
        { id: 'a3', title: 'Listening Quiz 1', due: '2025-08-12', studentStatus: 'submitted' },
        { id: 'a4', title: 'Speaking: Short Presentation', due: '2025-08-18', studentStatus: 'not_submitted' },
        { id: 'a5', title: 'Writing Task 2 (Essay)', due: '2025-08-22', studentStatus: 'graded', grade: 8 },
        { id: 'a6', title: 'Vocabulary Quiz: Daily Activities', due: '2025-08-25', studentStatus: 'submitted' },
        { id: 'a7', title: 'Grammar Worksheet — Past Simple', due: '2025-09-01', studentStatus: 'graded', grade: 7 }
    ]);

    const [gradeDialog, setGradeDialog] = useState({ visible: false, assignment: null });
    //data điểm danh
    const [attendanceHistory] = useState([
        { session: 1, date: '2025-06-01', present: true },
        { session: 2, date: '2025-06-03', present: true },
        { session: 3, date: '2025-06-07', present: false },
        { session: 4, date: '2025-06-10', present: true },
        { session: 5, date: '2025-06-12', present: true },
        { session: 6, date: '2025-06-15', present: true },
        { session: 7, date: '2025-06-18', present: false },
        { session: 8, date: '2025-06-20', present: true },
        { session: 9, date: '2025-06-24', present: true }
    ]);
    //data hoat động
    const [activities] = useState([
        { id: 'act1', date: new Date(Date.now() - 2 * 60 * 60 * 1000), text: 'GV đã tải lên: Lesson 02 - Reading' },
        { id: 'act2', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), text: 'GV đã bình luận: Writing Task 1' },
        { id: 'act3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), text: 'Bạn đã nộp Assignment: Reading - Week 2' },
        { id: 'act4', date: new Date(Date.now() - 3 * 60 * 60 * 1000), text: 'GV đã tải lên: Lesson 03 - Listening' },
        { id: 'act5', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), text: 'GV đăng thông báo: Lịch thi giữa kỳ' },
        { id: 'act6', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), text: 'Bạn đã xem kết quả Writing Task 1' },
        { id: 'act7', date: new Date(Date.now() - 30 * 60 * 1000), text: 'GV bình luận bài nộp: Reading - Week 2' }
    ]);
    //data giáo trình
    const syllabusData = [
        { id: 'w1', week: 'Tuần 1 — Orientation & Diagnostic Test', desc: 'Đánh giá năng lực, giới thiệu lộ trình', detail: 'Học viên làm bài kiểm tra đầu vào, giới thiệu giáo trình, cách học và tiêu chí đánh giá.', objectives: ['Đánh giá trình độ', 'Hiểu lộ trình học', 'Thiết lập mục tiêu cá nhân'], activities: ['Test đầu vào (Listening & Reading)', 'Phỏng vấn ngắn Speaking'], materials: ['Syllabus PDF', 'Form test đầu vào'] },
        { id: 'w2', week: 'Tuần 2 — Pronunciation & Phonics', desc: 'Làm quen phát âm chuẩn, luyện âm cơ bản', detail: 'Tập trung vào nguyên âm, phụ âm khó, ngữ điệu và luyện phát âm qua bài tập ngắn.', objectives: ['Nắm các âm cơ bản', 'Cải thiện phát âm rõ ràng'], activities: ['Bài luyện phát âm / minimal pairs', 'Thực hành theo cặp'], materials: ['Worksheet phát âm', 'Audio mẫu'] },
        { id: 'w3', week: 'Tuần 3 — Basic Grammar: Present Simple', desc: 'Cấu trúc thì hiện tại đơn, luyện tập hội thoại', detail: 'Học cấu trúc khẳng định, phủ định, nghi vấn và áp dụng vào hội thoại ngắn.', objectives: ['Sử dụng Present Simple chính xác', 'Viết câu đơn giản đúng ngữ pháp'], activities: ['Bài tập cấu trúc', 'Role-play tình huống hàng ngày'], materials: ['Slides ngữ pháp', 'Exercise sheet'] },
        { id: 'w4', week: 'Tuần 4 — Vocabulary: Daily Activities', desc: 'Từ vựng về sinh hoạt hằng ngày, luyện nói', detail: 'Mở rộng từ vựng chủ đề, collocations, và luyện mô tả thói quen.', objectives: ['Thuộc 40-50 từ chủ đề', 'Sử dụng collocations phù hợp'], activities: ['Flashcards', 'Speaking pair work'], materials: ['List từ vựng', 'Quiz nhanh'] },
        { id: 'w5', week: 'Tuần 5 — Listening Skills 1', desc: 'Nghe hiểu các đoạn hội thoại ngắn', detail: 'Luyện nghe gist và detail cho các đoạn hội thoại ngắn, kỹ thuật dự đoán nội dung.', objectives: ['Bắt ý chính', 'Luyện nghe với tốc độ nói tự nhiên'], activities: ['Nghe đoạn hội thoại', 'Trắc nghiệm understanding'], materials: ['Audio scripts', 'Workbook exercises'] },
        { id: 'w6', week: 'Tuần 6 — Grammar: Present Continuous', desc: 'Cấu trúc thì hiện tại tiếp diễn, luyện ngữ cảnh thực tế', detail: 'Ứng dụng Present Continuous để nói về hành động đang xảy ra và kế hoạch tương lai gần.', objectives: ['Sử dụng Present Continuous đúng ngữ cảnh'], activities: ['Bài tập chuyển đổi thì', 'Mini-dialogues'], materials: ['Grammar sheet', 'Exercises'] }
    ];
    //ẩn hiện
    const [syllabusVisible, setSyllabusVisible] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [expanded, setExpanded] = useState(() => new Set());
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [animatedProgress, setAnimatedProgress] = useState(0);
    //chạy process
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
    //mobile ?
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 980px)');
        const handler = (e) => setIsMobile(e.matches);
        handler(mq);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    //xử lí tạm đăng bt
    const onUploadHandler = (event, assignmentId) => {
        const file = event.files && event.files[0];
        if (!file) return;
        const a = assignments.find((x) => x.id === assignmentId);
        if (!a) return;
        const st = getAssignmentStatus(a);
        if (st.kind === 'overdue') {
            const ok = window.confirm('Bài này đã quá hạn. Bạn vẫn muốn nộp?');
            if (!ok) return;
        }
        toast.current && toast.current.show({ severity: 'info', summary: 'Đang tải lên', detail: file.name, life: 1200 });
        setTimeout(() => {
            setAssignments((prev) => prev.map((it) => (it.id === assignmentId ? { ...it, studentStatus: 'submitted' } : it)));
            toast.current && toast.current.show({ severity: 'success', summary: 'Nộp bài thành công', detail: a.title + ' đã nộp', life: 1600 });
        }, 900);
    };

    const remaining = Math.max(0, 100 - student.progress);
    //xếp bt xep hạn
    const nextDue = assignments
        .filter((a) => new Date(a.due) >= new Date())
        .sort((a, b) => new Date(a.due) - new Date(b.due))[0];

    const nextSession = { date: '2025-08-12T18:00:00', topic: 'Lesson 08 - Writing Task 2' };
    //định dạng này ( k b cần không )
    const formatDate = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        return `${day}/${month}/${year}`;
    };
    //thêm giờ '
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
    //ngày so với hnay
    const daysDiff = (d) => {
        if (!d) return null;
        const now = new Date();
        const due = new Date(d);
        const diffMs = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.ceil(diffMs / msPerDay);
    };
    //trạng thái bt
    const getAssignmentStatus = (a) => {
        if (a.studentStatus === 'graded') return { kind: 'graded', label: `Điểm ${a.grade}`, variant: 'success' };
        if (a.studentStatus === 'submitted') return { kind: 'submitted', label: 'Đã nộp', variant: 'info' };
        const diff = daysDiff(a.due);
        if (diff == null) return { kind: 'pending', label: 'Chưa nộp', variant: 'neutral' };
        if (diff < 0) return { kind: 'overdue', label: `Quá hạn ${Math.abs(diff)} ngày`, variant: 'danger' };
        if (diff <= 3) return { kind: 'due_soon', label: `Còn ${diff} ngày`, variant: 'warning' };
        return { kind: 'pending', label: 'Chưa nộp', variant: 'neutral' };
    };

    const isCurrentWeek = (index) => index === Math.max(0, Math.min(syllabusData.length - 1, course.lessonsCompleted - 1));

    const toggleExpanded = (id) => {
        setExpanded((prev) => {
            const copy = new Set(prev);
            if (copy.has(id)) copy.delete(id);
            else copy.add(id);
            return copy;
        });
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
        return <Tag value={s.label} severity={severity} className="p-mr-2 p-py-2" />;
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

    // header template for Panel (week card) to keep actions on the right
    const syllabusHeader = (item, open) => (
        <div className="p-d-flex p-jc-between p-ai-center syllabus-card-main">
            <div className="p-d-flex p-flex-column syllabus-info">
                <div className="p-d-flex p-ai-center syllabus-head">
                    <strong className="syllabus-week">{item.week}</strong>
                </div>
                <div className="small-muted syllabus-desc">{item.desc}</div>
            </div>
            <div className="syllabus-actions p-d-flex p-ai-center" role="group" aria-label="Hành động tuần">
                <Button
                    icon={open ? 'pi pi-chevron-up' : 'pi pi-eye'}
                    className="p-button-rounded p-button-text cd-icon-btn"
                    onClick={() => toggleExpanded(item.id)}
                    aria-label={open ? 'Thu gọn' : 'Xem chi tiết'}
                />
            </div>
        </div>
    );


    return (
        <div className="cd-root p-p-4">
            <Toast ref={toast} />
            <Tooltip target=".cd-progress" />
            <Card className="cd-header p-d-flex p-ai-center p-p-4">
                <div className="p-d-flex p-ai-center p-jc-start" style={{ gap: 16 }}>
                    <Avatar label={course.title.charAt(0)} size="xlarge" shape="square" style={{ background: '#7e57c2', color: '#fff' }} aria-hidden="true" />
                    <div className="cd-course-meta">
                        <h2 className="cd-course-title">🎓 {course.title}</h2>
                        <div className="p-d-flex p-flex-wrap cd-pills" style={{ gap: 8 }}>
                            <Tag icon="pi pi-user" className="cd-pill" severity="info" value={`GV: ${course.teacher}`} />
                            <Tag icon="pi pi-map-marker" className="cd-pill" value={`Phòng: ${course.room}`} />
                            <Tag icon="pi pi-calendar" className="cd-pill" value={course.schedule} />
                            <Tag className="cd-pill tag-subject" value={course.subject} />
                        </div>
                    </div>
                </div>
            </Card>
            <div className="p-grid cd-layout">
                <main className="p-col-12 p-md-8 cd-main">
                    <div className="tabs-row">
                        <TabView>
                            <TabPanel header={<span className="tab-header">📘<span className="tab-title">Giáo trình</span></span>}>
                                <div className="syllabus-list p-d-flex p-flex-column p-mt-2">
                                    {syllabusData.map((item, idx) => {
                                        const open = expanded.has(item.id);
                                        const isCurrent = isCurrentWeek(idx);
                                        return (
                                            <Panel key={item.id} className={classNames('syllabus-card', { current: isCurrent })} header={syllabusHeader(item, open)} toggleable={false}>
                                                {open && (
                                                    <div className="syllabus-detail p-mt-3">
                                                        <p className="small-muted">{item.detail}</p>
                                                        <div className="syllabus-grid p-grid p-mt-2">
                                                            <div className="p-col-12 p-md-6">
                                                                <h6>Mục tiêu</h6>
                                                                <ul>{item.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
                                                            </div>
                                                            <div className="p-col-12 p-md-6">
                                                                <h6>Hoạt động</h6>
                                                                <ul>{item.activities.map((a, i) => <li key={i}>{a}</li>)}</ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Panel>
                                        );
                                    })}
                                </div>
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">📝<span className="tab-title">Bài tập</span></span>}>
                                <div className="p-d-flex p-ai-center p-mb-2 p-flex-wrap" style={{ gap: 12 }}>
                                    <div className="small-muted">Bộ lọc:</div>
                                    {['all', 'due_soon', 'overdue', 'not_submitted', 'submitted', 'graded'].map((k) => (
                                        <Button key={k} className={classNames({ 'p-button-text': assignmentFilter !== k })} onClick={() => setAssignmentFilter(k)} label={k === 'all' ? 'Tất cả' : k === 'due_soon' ? 'Sắp hết hạn' : k === 'overdue' ? 'Quá hạn' : k === 'not_submitted' ? 'Chưa nộp' : k === 'submitted' ? 'Đã nộp' : 'Đã chấm'} />
                                    ))}
                                </div>

                                <Card className="assignments-table p-mt-2">
                                    <DataTable value={filteredAssignments} responsiveLayout="stack" className="assignments-table" emptyMessage="Không có bài tập để hiển thị">
                                        <Column field="title" header="Bài tập" body={(row) => <div className="assign-title">{row.title}</div>} />

                                        <Column header="Hạn nộp" body={(row) => (
                                            <div>
                                                <div className="due-date">{formatDate(row.due)}</div>
                                                <div className="due-meta">
                                                    {(() => {
                                                        const diff = daysDiff(row.due);
                                                        if (diff == null) return '';
                                                        if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`;
                                                        if (diff === 0) return 'Hôm nay';
                                                        return `Còn ${diff} ngày`;
                                                    })()}
                                                </div>
                                            </div>
                                        )} />

                                        <Column header="Trạng thái" body={(row) => assignmentStatusBody(row)} />

                                        <Column header="Hành động" body={(row) => {
                                            const s = getAssignmentStatus(row);
                                            if (s.kind === 'pending' || s.kind === 'due_soon' || s.kind === 'overdue') {
                                                return (
                                                    <FileUpload mode="basic" name="file" customUpload accept=".pdf,.doc,.docx" maxFileSize={20 * 1024 * 1024} chooseLabel="Nộp" uploadHandler={(e) => onUploadHandler(e, row.id)} multiple={false} auto={true} className="btn-upload" />
                                                );
                                            }
                                            if (s.kind === 'submitted') {
                                                return <Button label="Đã nộp" icon="pi pi-check" disabled className="btn-submitted" />;
                                            }
                                            if (s.kind === 'graded') {
                                                return <Button className="p-button-text btn-view-grade" label={`Xem điểm ${row.grade}`} onClick={() => setGradeDialog({ visible: true, assignment: row })} />;
                                            }
                                            return null;
                                        }} />
                                    </DataTable>
                                </Card>

                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🗓️<span className="tab-title">Lịch sử điểm danh</span></span>}>
                                <div className="attendance-summary p-mt-2">
                                    <div className="p-mb-3 p-text-bold">Có mặt: {attendanceHistory.filter(a => a.present).length} • Vắng: {attendanceHistory.filter(a => !a.present).length} • Điểm danh: {student.attendancePct}%</div>
                                    <Card>
                                        <DataTable value={attendanceHistory} responsiveLayout="scroll" className="p-mt-2">
                                            <Column field="session" header="Buổi" />
                                            <Column field="date" header="Ngày" body={(row) => formatDate(row.date)} />
                                            <Column body={(row) => row.present ? <Tag value="Có mặt" severity="success" /> : <Tag value="Vắng" severity="danger" />} header="Trạng thái" />
                                        </DataTable>
                                    </Card>
                                </div>
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🔥<span className="tab-title">Hoạt động</span></span>}>
                                <div className="activity-list p-mt-2">
                                    {activities.map((a) => (
                                        <Card key={a.id} className={classNames('activity-item', { recent: isRecent(a.date) })}>
                                            <div className="p-d-flex p-ai-start p-jc-between">
                                                <div style={{ width: 64 }}>
                                                    {isRecent(a.date) ? <Badge value="Mới" severity="success" className="activity-badge" /> : <div className="activity-spacer" />}
                                                </div>
                                                <div className="activity-content" style={{ flex: 1 }}>
                                                    <div className="activity-top p-d-flex p-jc-between p-ai-start">
                                                        <div className="activity-text"><strong className="activity-title">{a.text}</strong></div>
                                                        <div className="activity-time small-muted">{formatFullDateTime(a.date)} <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>({timeAgo(a.date)})</span></div>
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
                            <ProgressBar value={animatedProgress} showValue={false} className="cd-progress" />
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
                            <div className="qi-row p-d-flex p-ai-start">
                                <div className="qi-label">📅 <strong>Buổi tiếp theo</strong></div>
                                <div className="qi-value">
                                    <div className="qi-date">{formatFullDateTime(nextSession.date)}</div>
                                    <div className="qi-topic">{nextSession.topic}</div>
                                </div>
                            </div>

                            <div className="qi-row p-d-flex p-ai-start p-mt-2">
                                <div className="qi-label">📚 <strong>Bài còn lại</strong></div>
                                <div className="qi-value">{course.totalLessons - course.lessonsCompleted} buổi</div>
                            </div>

                            {nextDue && (
                                <div className={classNames('qi-row p-d-flex p-ai-start p-mt-2', { 'qi-overdue': daysDiff(nextDue.due) < 0 })}>
                                    <div className="qi-label">⏳ <strong>Deadline kế tiếp</strong></div>
                                    <div className="qi-value">
                                        <div className="qi-date">{nextDue.title}</div>
                                        <div className="qi-topic">{formatDate(nextDue.due)} {daysDiff(nextDue.due) < 0 ? `· Quá hạn ${Math.abs(daysDiff(nextDue.due))} ngày` : `· Còn ${daysDiff(nextDue.due)} ngày`}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </aside>
            </div>

            <Dialog header={selectedSyllabus?.week || 'Chi tiết tuần'} visible={syllabusVisible} style={{ width: isMobile ? '95vw' : '50vw' }} modal onHide={() => setSyllabusVisible(false)} maximizable>
                {selectedSyllabus ? (
                    <div>
                        <p className="small-muted">{selectedSyllabus.desc}</p>
                        <p>{selectedSyllabus.detail}</p>
                        <h5>Mục tiêu</h5>
                        <ul>{selectedSyllabus.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
                        <h5>Hoạt động chính</h5>
                        <ul>{selectedSyllabus.activities.map((a, i) => <li key={i}>{a}</li>)}</ul>
                        <h5>Tài liệu</h5>
                        <ul>{selectedSyllabus.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
                    </div>
                ) : (
                    <p>Không có dữ liệu.</p>
                )}
            </Dialog>

        </div>
    );
}
