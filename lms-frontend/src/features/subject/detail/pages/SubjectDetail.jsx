import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';

import '../styles/subject-detail.css';
import SubjectHero from '../components/SubjectHero.jsx';
import SubjectOutline from '../components/SubjectOutline.jsx';
import SubjectClassTable from '../components/SubjectClassTable.jsx';
import SubjectSidebar from '../components/SubjectSidebar.jsx';
import { getSubjectDetail } from '@/features/subject/api/subjectService.js';

const tabs = [
    { label: 'Overview', icon: 'pi pi-home' },
    { label: 'Syllabus', icon: 'pi pi-list-check' },
    { label: 'Sessions', icon: 'pi pi-calendar' },
    { label: 'Resources', icon: 'pi pi-download' },
    { label: 'Reviews', icon: 'pi pi-star' },
    { label: 'Q&A', icon: 'pi pi-comments' },
];

export default function SubjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getSubjectDetail(Number(id));
                if (!alive) return;
                setSubject(data);
            } catch (e) {
                console.error(e);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi tải dữ liệu',
                    detail: 'Không thể tải chi tiết môn học.',
                });
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id]);

    const outline =
        subject?.description?.split(/\r?\n/).map(s => s.trim()).filter(Boolean) ?? [];

    const handleEnrollScroll = () => {
        const el = document.getElementById('subject-classes');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(2);
    };

    const handleRegister = (courseId, className, schedule, startDate) => {
        if (!subject) return;
        const selectedClass = subject.classes?.find((c) => c.courseId === courseId);
        if (!selectedClass) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Không tìm thấy lớp',
                detail: 'Vui lòng chọn lại.',
            });
            return;
        }
        navigate('/payment', {
            state: {
                selectedItem: {
                    type: 'subject',
                    subjectId: subject.id,
                    title: `${subject.title} - ${className || selectedClass.courseTitle}`,
                    price: Number(subject.fee) || 0,
                    meta: {
                        subject: {
                            id: subject.id,
                            code: subject.code,
                            title: subject.title,
                            sessionNumber: subject.sessionNumber,
                        },
                        class: {
                            id: selectedClass.courseId,
                            title: selectedClass.courseTitle || className,
                            code: selectedClass.courseCode,
                            startDate: startDate ?? selectedClass.startDate,
                            schedule: schedule ?? selectedClass.schedule,
                            sessions: selectedClass.plannedSessions,
                            capacity: selectedClass.capacity,
                            status: selectedClass.status,
                            statusName: selectedClass.statusName,
                            place: selectedClass.place || selectedClass.room || '',
                            mode: selectedClass.mode || subject.mode || 'Hybrid',
                        },
                    },
                }
            }
        });
    };

    return (
        <div className="sd-wrap">
            <Toast ref={toast} />

            {loading && (
                <>
                    <div className="sd-hero sk">
                        <Skeleton width="48%" height="300px" />
                        <div className="sk-col">
                            <Skeleton width="60%" height="28px" className="mb-2" />
                            <Skeleton width="30%" height="26px" className="mb-3" />
                            <Skeleton width="90%" height="16px" className="mb-2" />
                            <Skeleton width="80%" height="16px" className="mb-2" />
                            <Skeleton width="160px" height="42px" />
                        </div>
                    </div>
                    <Skeleton width="100%" height="40px" className="mb-3" />
                    <div className="sd-grid">
                        <div className="sd-main">
                            <Skeleton width="100%" height="260px" />
                            <Skeleton width="100%" height="260px" />
                        </div>
                        <Skeleton width="100%" height="420px" />
                    </div>
                </>
            )}

            {!loading && subject && (
                <>
                    {/* HERO */}
                    <SubjectHero subject={subject} onEnrollClick={handleEnrollScroll} />

                    {/* Tabs */}
                    <div className="sd-tabs">
                        <TabMenu
                            model={tabs}
                            activeIndex={active}
                            onTabChange={(e) => setActive(e.index)}
                            className="sd-tabmenu"
                        />
                        <Button
                            label="Enroll now"
                            className="p-button-primary p-button-lg sd-enroll-cta"
                            onClick={handleEnrollScroll}
                        />
                    </div>

                    {/* Main + Sidebar */}
                    <div className="sd-grid">
                        <main className="sd-main">
                            {active === 0 && (
                                <section className="sd-card">
                                    <h3 className="sd-h3">Mô tả khóa học</h3>
                                    <p className="sd-summary">
                                        {subject.summary ||
                                            'Khóa học Listening được thiết kế cho trình độ trung cấp, tập trung chiến lược làm bài, luyện tập chuyên sâu và phản hồi cá nhân hóa để đạt band mục tiêu.'}
                                    </p>

                                    <h4 className="sd-h4">Bạn sẽ học được</h4>
                                    <ul className="sd-list">
                                        {(outline.length
                                            ? outline
                                            : [
                                                'Nhận diện thông tin chính từ bài giảng & hội thoại học thuật',
                                                'Thành thạo các dạng câu hỏi: MCQ, Matching, Gap-fill…',
                                                'Ghi chép hiệu quả cho tài liệu audio phức tạp',
                                                'Tăng khả năng tập trung trong các đoạn nghe dài',
                                                'Làm quen đa dạng accent và tốc độ nói',
                                            ]).map((x, i) => <li key={i}>{x}</li>)}
                                    </ul>
                                </section>
                            )}

                            {active === 1 && (
                                <SubjectOutline outline={outline} subject={subject} />
                            )}

                            {active === 2 && (
                                <section id="subject-classes" className="sd-card">
                                    <SubjectClassTable
                                        classes={subject.classes ?? []}
                                        onRegister={handleRegister}
                                    />
                                </section>
                            )}

                            {(active === 3 || active === 4 || active === 5) && (
                                <section className="sd-card">
                                    <div className="text-600">Nội dung “{tabs[active].label}” sẽ được cập nhật.</div>
                                </section>
                            )}
                        </main>

                        <SubjectSidebar subject={subject} />
                    </div>
                </>
            )}

            {!loading && !subject && (
                <div className="sd-loading">Không tìm thấy môn học.</div>
            )}
        </div>
    );
}
