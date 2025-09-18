import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar} from 'primereact/avatar';
import {Button} from 'primereact/button';
import {TabPanel, TabView} from 'primereact/tabview';
import {ProgressBar} from 'primereact/progressbar';
import {Card} from 'primereact/card';
import {Tag} from "primereact/tag";
import LessonPage from '@/features/lesson/pages/LessonPage.jsx';
import AssignmentPage from '@/features/assignment/pages/AssignmentPage.jsx';
import AttendancePage from '@/features/attendance/pages/AttendancePage.jsx';
import ActivityPage from '@/features/activity/pages/ActivityPage.jsx';
import './CourseDetailStudent.css';

export default function CourseDetailStudent() {
    const {courseId, studentId} = useParams();

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

    return (
        <div className="cd-root p-p-4">
            <Card className="cd-header p-d-flex p-ai-center p-p-4">
                <div className="p-d-flex p-ai-center p-jc-start cd-header-left" style={{gap: 16}}>
                    <Avatar label={course.title.charAt(0)} size="xlarge" shape="square" className="cd-avatar" aria-hidden="true"/>
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
                            <TabPanel header={<span className="tab-header">📘<span className="tab-title">Giáo trình</span></span>}>
                                <LessonPage />
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">📝<span className="tab-title">Bài tập</span></span>}>
                                <AssignmentPage course={course} student={student} />
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🗓️<span className="tab-title">Lịch sử điểm danh</span></span>}>
                                <AttendancePage course={course} student={student} />
                            </TabPanel>

                            <TabPanel header={<span className="tab-header">🔥<span className="tab-title">Hoạt động</span></span>}>
                                <ActivityPage course={course} student={student} />
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
        </div>
    );
}
