import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { TabPanel, TabView } from "primereact/tabview";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import LessonPage from "@/features/lesson/pages/LessonPage.jsx";
import AssignmentPage from "@/features/assignment/student/pages/StudentAssignmentsPage.jsx";
import AttendancePage from "@/features/attendance/pages/AttendancePage.jsx";
import LeaveRequestForm from "@/features/leave/components/LeaveRequestForm.jsx";
import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";
import "./CourseDetailStudent.css";

export default function CourseDetailStudent() {
    // URL: /student/courses/:slug?id=6&subjectId=12
    const { slug } = useParams();
    const location = useLocation();

    // lấy courseId từ query string
    const search = new URLSearchParams(location.search);
    const courseIdParam = search.get("id");
    const courseId = courseIdParam ? Number(courseIdParam) : null;

    // nếu từ trang /student/courses navigate sang có truyền state
    const courseFromState = location.state?.course ?? null;

    const [course, setCourse] = useState(courseFromState);
    const [loadingCourse, setLoadingCourse] = useState(!courseFromState);

    // TODO: nếu sau này có API profile riêng thì thay phần mock student này
    const [student] = useState({
        id: "me",
        name: "Student",
        avatar: "S",
        email: "",
        phone: "",
        progress: 78,
        attendancePct: 92,
        enrolled: true,
        paymentStatus: "paid",
        notes: "",
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const handleTabChange = (e) => setActiveIndex(e.index);

    const handleSubmitted = (result) => {
        console.log("Leave request submitted", result);
    };

    const [animatedProgress, setAnimatedProgress] = useState(0);

    // load course detail nếu F5 / mở trực tiếp (state = null)
    useEffect(() => {
        if (course || !courseId) return;

        const loadCourse = async () => {
            try {
                setLoadingCourse(true);
                const res = await axiosClient.get(AppUrls.getStudentCourses);
                const apiRes = res.data || {};
                const payload = apiRes.result ?? apiRes.data ?? [];
                const list = Array.isArray(payload)
                    ? payload
                    : payload.content ?? payload.items ?? [];

                const found = (list || []).find(
                    (c) =>
                        c.courseId === courseId ||
                        c.id === courseId ||
                        c.course_id === courseId
                );

                if (found) {
                    setCourse(found);
                }
            } catch (e) {
                console.error("Failed to load student course detail", e);
            } finally {
                setLoadingCourse(false);
            }
        };

        void loadCourse();
    }, [course, courseId]);

    // animate progress bar (giữ như cũ)
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

    // fallback khi chưa có course
    if (!course && loadingCourse) {
        return (
            <div className="cd-root flex align-items-center justify-content-center">
                <i className="pi pi-spin pi-spinner mr-2" />
                Đang tải thông tin khóa học...
            </div>
        );
    }

    if (!course && !loadingCourse) {
        return (
            <div className="cd-root flex align-items-center justify-content-center">
                Không tìm thấy thông tin khóa học.
            </div>
        );
    }

    // map các field DTO về UI
    const title = course.courseName ?? course.title ?? "Course";
    const subject = course.subjectName ?? course.subject ?? "";
    const teacher =
        course.teacherName ?? course.teacher ?? course.lecturerName ?? "";
    const room = course.roomName ?? course.room ?? course.classroom ?? "";
    const schedule = course.schedule ?? course.scheduleText ?? "";

    return (
        <div className="cd-root">
            <div className="cd-container">
                <Card className="cd-header p-d-flex p-ai-center p-p-4">
                    <div
                        className="p-d-flex p-ai-center p-jc-start cd-header-left"
                        style={{ gap: 16 }}
                    >
                        <Avatar
                            label={title.charAt(0)}
                            size="xlarge"
                            shape="square"
                            className="cd-avatar"
                            aria-hidden="true"
                        />
                        <div className="cd-course-meta">
                            <h2 className="cd-course-title">🎓 {title}</h2>
                            <div className="p-d-flex p-flex-wrap cd-pills">
                                {teacher && (
                                    <Tag
                                        icon="pi pi-user"
                                        className="cd-pill pill-teacher"
                                        value={`Teacher: ${teacher}`}
                                    />
                                )}
                                {room && (
                                    <Tag
                                        icon="pi pi-map-marker"
                                        className="cd-pill pill-room"
                                        value={`Phòng: ${room}`}
                                    />
                                )}
                                {schedule && (
                                    <Tag
                                        icon="pi pi-calendar"
                                        className="cd-pill pill-schedule"
                                        value={schedule}
                                    />
                                )}
                                {subject && (
                                    <Tag
                                        className="cd-pill tag-subject"
                                        value={subject}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="cd-tabs-wrapper">
                    <TabView
                        activeIndex={activeIndex}
                        onTabChange={handleTabChange}
                        className="cd-tabview"
                    >
                        <TabPanel
                            header={
                                <span className="tab-header">
                                    📘{" "}
                                    <span className="tab-title">Syllabus</span>
                                </span>
                            }
                        >
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <LessonPage />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel
                            header={
                                <span className="tab-header">
                                    📝{" "}
                                    <span className="tab-title">
                                        Assignment
                                    </span>
                                </span>
                            }
                        >
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        {/* StudentAssignmentsPage đã gọi fetchStudentAssignments(course.id) */}
                                        <AssignmentPage
                                            course={course}
                                            student={student}
                                        />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel
                            header={
                                <span className="tab-header">
                                    🗓️{" "}
                                    <span className="tab-title">
                                        Attendance History
                                    </span>
                                </span>
                            }
                        >
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <AttendancePage
                                            course={course}
                                            student={student}
                                        />
                                    </main>
                                    <aside className="p-col-12 p-md-4 cd-sidebar" />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel
                            header={
                                <span className="tab-header">
                                    🗒️{" "}
                                    <span className="tab-title">Absent</span>
                                </span>
                            }
                        >
                            <div className="cd-panel-inner">
                                <div className="p-grid cd-layout">
                                    <main className="p-col-12 p-md-8 cd-main">
                                        <LeaveRequestForm
                                            inline
                                            course={course}
                                            student={student}
                                            sessions={[]}
                                            onSubmitted={handleSubmitted}
                                        />
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
