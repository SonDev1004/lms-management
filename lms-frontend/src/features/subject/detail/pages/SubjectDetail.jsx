import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { TabMenu } from "primereact/tabmenu";
import { Button } from "primereact/button";

import "@/features/subject/detail/styles/subject-detail.css";
import "@/features/program/detail/styles/subjects-section.css";

import SubjectHero from "@/features/subject/detail/components/SubjectHero.jsx";
import SubjectOutline from "@/features/subject/detail/components/SubjectOutline.jsx";
import SubjectSidebar from "@/features/subject/detail/components/SubjectSidebar.jsx";

import { getSubjectDetail } from "@/features/subject/api/subjectService.js";
import { parseCurrency } from "@/features/payment/utils/money.js";
import { sessionsText, shortDate } from "@/features/program/detail/utils/format";

const tabs = [
    { label: "Overview", icon: "pi pi-home" },
    { label: "Syllabus", icon: "pi pi-list-check" },
    { label: "Courses", icon: "pi pi-calendar" },
    { label: "Resources", icon: "pi pi-download" },
    { label: "Reviews", icon: "pi pi-star" },
    { label: "Q&A", icon: "pi pi-comments" },
];

function SubjectCoursesCardList({ subject, onRegister }) {
    const classes = subject?.classes ?? [];

    if (!classes.length) {
        return (
            <div className="text-600">
                Chưa có lớp (course) nào cho subject này. Vui lòng quay lại sau hoặc liên hệ admin.
            </div>
        );
    }

    return (
        <div className="subjects-card" style={{ marginTop: 0 }}>
            <h3 className="section-title">Chọn Lịch Học</h3>

            {classes.map((c) => {
                const start = c.startDate ? shortDate(c.startDate) : "";
                const schedule = c.schedule || c.scheduleText || "";
                const place = c.place || c.room || "";
                const sessions = c.plannedSessions ?? c.sessions ?? subject?.sessionNumber ?? null;

                const statusText =
                    (c.statusName || c.status || "Upcoming").toString();

                return (
                    <div className="course-card" key={c.courseId}>
                        <div className="course-row">
                            <div className="course-title">
                                <span>{c.courseTitle || subject?.title || "Course"}</span>
                                {!!c.courseCode && <span className="tag">Mã lớp: {c.courseCode}</span>}
                            </div>

                            <div className="actions">
                                <Button
                                    icon="pi pi-shopping-cart"
                                    label="Đăng ký"
                                    onClick={() =>
                                        onRegister(
                                            c.courseId,
                                            c.courseTitle || subject?.title,
                                            schedule,
                                            c.startDate
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="meta">
                            {!!start && (
                                <span>
                  <i className="pi pi-calendar" /> {start}
                </span>
                            )}
                            {!!schedule && (
                                <span>
                  <i className="pi pi-clock" /> {schedule}
                </span>
                            )}
                            {!!sessions && (
                                <span>
                  <i className="pi pi-book" /> {sessionsText(sessions)}
                </span>
                            )}
                            {!!place && (
                                <span>
                  <i className="pi pi-map-marker" /> {place}
                </span>
                            )}
                            {typeof c.capacity === "number" && (
                                <span>
                  <i className="pi pi-users" /> {c.capacity} chỗ
                </span>
                            )}
                            {!!statusText && (
                                <span>
                  <i className="pi pi-info-circle" /> {statusText}
                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

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
                    severity: "error",
                    summary: "Data loading error",
                    detail: "Unable to load subject details.",
                });
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    const outline = useMemo(() => {
        return subject?.description
            ?.split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean) ?? [];
    }, [subject]);

    const handleEnrollScroll = () => {
        const el = document.getElementById("subject-classes");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(2);
    };

    // Click “Upcoming …” ở sidebar → chuyển tab Courses và scroll tới danh sách
    const handleSelectUpcoming = () => {
        setActive(2);
        setTimeout(() => {
            document
                .getElementById("subject-classes")
                ?.scrollIntoView({ behavior: "smooth" });
        }, 80);
    };

    // Đăng ký 1 course (class) cụ thể → sang payment
    const handleRegister = (courseId, className, schedule, startDate) => {
        if (!subject) return;

        const selectedClass = subject.classes?.find((c) => c.courseId === courseId);
        if (!selectedClass) {
            toast.current?.show({
                severity: "warn",
                summary: "Class not found",
                detail: "Please select again.",
            });
            return;
        }

        navigate("/payment", {
            state: {
                selectedItem: {
                    type: "subject",
                    programId: null, // mua lẻ subject → không dùng programId
                    subjectId: subject.id,
                    trackCode: null, // mua lẻ subject → không dùng trackCode
                    title: `${subject.title} - ${className || selectedClass.courseTitle}`,
                    price: parseCurrency(subject.fee) || 0,
                    meta: {
                        subject: {
                            id: subject.id,
                            code: subject.code,
                            title: subject.title,
                            sessionNumber: subject.sessionNumber,
                        },
                        class: {
                            id: selectedClass.courseId, // IMPORTANT: courseId để BE lưu pending_enrollment.course_id
                            title: selectedClass.courseTitle || className,
                            code: selectedClass.courseCode,
                            startDate: startDate ?? selectedClass.startDate,
                            schedule: schedule ?? selectedClass.schedule,
                            sessions: selectedClass.plannedSessions,
                            capacity: selectedClass.capacity,
                            status: selectedClass.status,
                            statusName: selectedClass.statusName,
                            place: selectedClass.place || selectedClass.room || "",
                            mode: selectedClass.mode || subject.mode || "Hybrid",
                        },
                    },
                },
            },
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
                        </div>
                        <div className="sd-side">
                            <Skeleton width="100%" height="260px" />
                        </div>
                    </div>
                </>
            )}

            {!loading && subject && (
                <>
                    <SubjectHero subject={subject} onEnroll={handleEnrollScroll} />

                    <TabMenu
                        model={tabs}
                        activeIndex={active}
                        onTabChange={(e) => setActive(e.index)}
                    />

                    <div className="sd-grid">
                        <main className="sd-main">
                            {active === 0 && (
                                <section className="sd-card">
                                    <h3 className="sd-h3">Course Description</h3>
                                    <p className="sd-summary">
                                        {subject.summary ||
                                            "This course is designed for intermediate learners, focusing on strategies, intensive practice, and personalized feedback."}
                                    </p>

                                    <h4 className="sd-h4">What you’ll learn</h4>
                                    <ul className="sd-list">
                                        {(outline.length
                                                ? outline
                                                : [
                                                    "Build core skills systematically",
                                                    "Practice with real tasks and feedback",
                                                    "Improve confidence and performance",
                                                ]
                                        ).map((x, i) => (
                                            <li key={i}>{x}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {active === 1 && (
                                <SubjectOutline outline={outline} subject={subject} />
                            )}

                            {active === 2 && (
                                <section id="subject-classes" className="sd-card">
                                    <SubjectCoursesCardList
                                        subject={subject}
                                        onRegister={handleRegister}
                                    />
                                </section>
                            )}

                            {(active === 3 || active === 4 || active === 5) && (
                                <section className="sd-card">
                                    <div className="text-600">
                                        Content for “{tabs[active].label}” will be updated soon.
                                    </div>
                                </section>
                            )}
                        </main>

                        <SubjectSidebar subject={subject} onSelectUpcoming={handleSelectUpcoming} />
                    </div>
                </>
            )}

            {!loading && !subject && (
                <div className="sd-loading">Subject not found.</div>
            )}
        </div>
    );
}
