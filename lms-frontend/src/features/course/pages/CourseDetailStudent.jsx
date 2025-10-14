import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { TabPanel, TabView } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import LessonPage from '@/features/lesson/pages/LessonPage.jsx';
import AssignmentPage from '@/features/assignment/pages/AssignmentPage.jsx';
import AttendancePage from '@/features/attendance/pages/AttendancePage.jsx';
import LeaveRequestForm from '@/features/leave/components/LeaveRequestForm.jsx';
import './CourseDetailStudent.css';

export default function CourseDetailStudent() {
    const { courseId, studentId } = useParams();

    const course = {
        id: courseId || 'c1',
        title: 'IELTS Intermediate',
        subject: 'IELTS',
        teacher: 'Ngô Tống Quốc',
        room: 'P101',
        schedule: 'T2-T4 18:00-20:00',
        description:
            'IELTS Intermediate class for learners aiming for 6.0–6.5. Focus on Reading & Writing with Speaking practice.',
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
        notes: 'Pay attention to Writing: paragraph structure and word count.'
    });

    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (e) => setActiveIndex(e.index);

    const handleSubmitted = (result) => {
        console.log('Leave request submitted', result);
    };

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

    return (
        <div className="cd-root">
            {/* centered container so header + tabs share the exact same max width */}
            <div className="cd-container">
                <Card className="cd-header p-d-flex p-ai-center p-p-4">
                    <div className="p-d-flex p-ai-center p-jc-start cd-header-left" style={{ gap: 16 }}>
                        <Avatar label={course.title.charAt(0)} size="xlarge" shape="square" className="cd-avatar" aria-hidden="true" />
                        <div className="cd-course-meta">
                            <h2 className="cd-course-title">🎓 {course.title}</h2>
                            <div className="p-d-flex p-flex-wrap cd-pills">
                                <Tag icon="pi pi-user" className="cd-pill pill-teacher" value={`Teacher: ${course.teacher}`} />
                                <Tag icon="pi pi-map-marker" className="cd-pill pill-room" value={`Phòng: ${course.room}`} />
                                <Tag icon="pi pi-calendar" className="cd-pill pill-schedule" value={course.schedule} />
                                <Tag className="cd-pill tag-subject" value={course.subject} />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs wrapper: full-width inside the cd-container so it lines up with header */}
                <div className="cd-tabs-wrapper">
                    <TabView activeIndex={activeIndex} onTabChange={handleTabChange} className="cd-tabview">
                        <TabPanel header={<span className="tab-header">📘 <span className="tab-title">Syllabus</span></span>}>
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <LessonPage />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel header={<span className="tab-header">📝 <span className="tab-title">Assignment</span></span>}>
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <AssignmentPage course={course} student={student} />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel header={<span className="tab-header">🗓️ <span className="tab-title">Lịch sử điểm danh</span></span>}>
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <AttendancePage course={course} student={student} />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel header={<span className="tab-header">🗒️ <span className="tab-title">Xin nghỉ</span></span>}>
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <LeaveRequestForm inline course={course} student={student} sessions={[]} onSubmitted={handleSubmitted} />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}
