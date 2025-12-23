import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

import StatCard from "../components/StatCard";
import ControlsBar from "../components/ControlsBar";
import SectionTabs from "../components/SectionTabs";
import ClassCard from "../components/ClassCard";

import AttendanceService from "@/features/attendance/api/attendanceService.js";
import SessionService from "@/features/session/api/sessionService.js";

import "../styles/attendance.css";

function isSameDay(a, b) {
    const da = new Date(a);
    const db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}

function isWithinDays(date, days) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function shortDate(date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(d);
}

function mapSessionStatusToLabel(status) {
    if (status === 1) return "In Progress";
    if (status === 2) return "Done";
    return "Scheduled";
}

export default function AttendancePage() {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("today");
    const [layout, setLayout] = useState("list");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // items sẽ thay thế classesMock
    const [items, setItems] = useState([]);

    // KPI từ summary (nếu có)
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const sessions = await SessionService.getSessionsByCourse(courseId);

                let sum = null;
                try {
                    sum = await AttendanceService.getAttendanceSummary(courseId);
                } catch (e) {
                    // không block UI nếu summary fail
                    sum = null;
                }

                if (!mounted) return;

                setSummary(sum);

                const today = new Date();

                // Map sessions -> items phù hợp UI hiện tại (ClassCard)
                const mapped = (sessions || []).map((s) => {
                    const date = s.date; // BE của bạn đang trả string/date

                    // studentCount theo cách A
                    const studentCount =
                        s.studentCount ??
                        s.student_count ??
                        0;

                    return {
                        id: s.id,

                        // Các field dưới đây đang được AttendancePage dùng để search/filter
                        title: `Session ${s.order ?? s.index ?? ""} • ${shortDate(date)}`.trim(),
                        code: `COURSE-${courseId}`,     // nếu bạn có courseCode thật thì thay
                        location: s.room ?? "",
                        campus: "",                      // nếu không có thì để ""
                        level: "",                       // nếu không có thì để ""
                        tags: [],

                        // field bạn cần hiển thị số học sinh
                        enrolled: Number(studentCount) || 0,

                        // nếu chưa có attendanceRate per-session thì để null/undefined
                        attendanceRate: undefined,

                        status: mapSessionStatusToLabel(s.status),

                        // filter tabs
                        isToday: isSameDay(date, today),
                        isRecent: isWithinDays(date, 7),

                        // UI behavior
                        starred: false,

                        // thêm field để điều hướng khi click card (nếu ClassCard hỗ trợ)
                        sessionId: s.id,
                        sessionDate: date,
                    };
                });

                setItems(mapped);
            } catch (e) {
                if (mounted) setError(e?.message || "Failed to load attendance data");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [courseId]);

    const stats = useMemo(() => {
        // Nếu summary BE có số chuẩn thì ưu tiên dùng
        const totalStudentsFromSummary =
            summary?.totalStudents ??
            summary?.total_students ??
            summary?.studentCount ??
            summary?.student_count;

        const avgAttendanceFromSummary =
            summary?.avgAttendance ??
            summary?.avg_attendance ??
            summary?.attendanceRate ??
            summary?.attendance_rate;

        const todayClasses = items.filter((i) => i.isToday);
        const totalClasses = todayClasses.length;

        const inProgress = items.filter((i) => i.status === "In Progress").length;

        // Total students: nếu summary không có thì fallback cộng enrolled (lưu ý: sẽ bị cộng nhiều lần nếu mỗi session đều enrolled)
        // => tốt nhất là summary trả totalStudents. Nếu không có, lấy max enrolled (vì enrolled là tổng course, giống nhau cho mọi session)
        const totalStudentsFallback = items.length ? Math.max(...items.map((i) => i.enrolled || 0)) : 0;

        const totalStudents = Number(totalStudentsFromSummary) || totalStudentsFallback;

        const avgAttendance =
            typeof avgAttendanceFromSummary === "number"
                ? Math.round(avgAttendanceFromSummary)
                : 0;

        return { totalClasses, inProgress, totalStudents, avgAttendance };
    }, [items, summary]);

    const filteredByTab = useMemo(() => {
        if (activeTab === "today") return items.filter((i) => i.isToday);
        if (activeTab === "starred") return items.filter((i) => i.starred);
        if (activeTab === "recent") return items.filter((i) => i.isRecent);
        return items;
    }, [activeTab, items]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return filteredByTab;
        return filteredByTab.filter((c) =>
            [c.title, c.code, c.location, c.campus, c.level, ...(c.tags || [])]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [filteredByTab, query]);

    const toggleStar = (id) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, starred: !it.starred } : it)));
    };

    const openAttendance = (sessionId, date) => {
        navigate(`/teacher/courses/${courseId}/sessions/${sessionId}/attendance`, {
            state: { courseId, date },
        });
    };

    return (
        <div className="att-shell">
            <div className="att-header">
                <div className="att-title">
                    <h1>Class Attendance</h1>
                    <p>Manage attendance for your classes</p>
                </div>

                <div className="att-date-pill">
                    <i className="pi pi-calendar" />
                    {new Date().toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            </div>

            {error && <div className="text-red-500 mb-2">{error}</div>}

            <div className="att-stats">
                <StatCard title="Total Classes" value={stats.totalClasses} icon="pi pi-calendar" tone="neutral" />
                <StatCard title="In Progress" value={stats.inProgress} icon="pi pi-clock" tone="neutral" />
                <StatCard title="Total Students" value={stats.totalStudents} icon="pi pi-users" tone="students" />
                <StatCard
                    title="Avg Attendance"
                    value={`${stats.avgAttendance}%`}
                    icon="pi pi-chart-line"
                    tone="success"
                    withTrend
                />
            </div>

            <div className="att-toolbar">
                <span className="p-input-icon-left att-search">
                    <i className="pi pi-search" />
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by session, code, room..."
                    />
                </span>
                <ControlsBar layout={layout} onLayoutChange={setLayout} onFilter={() => {}} />
            </div>

            <SectionTabs active={activeTab} onChange={setActiveTab} />

            {loading ? (
                <Card className="att-empty">
                    <div className="att-empty__inner">
                        <i className="pi pi-spin pi-spinner" />
                        <h3>Loading...</h3>
                        <p>Fetching sessions and attendance summary.</p>
                    </div>
                </Card>
            ) : visible.length === 0 ? (
                <Card className="att-empty">
                    <div className="att-empty__inner">
                        <i className="pi pi-inbox" />
                        <h3>No classes found</h3>
                        <p>Try adjusting filters or search keywords.</p>
                    </div>
                </Card>
            ) : (
                <div className={layout === "grid" ? "att-grid" : "att-list"}>
                    {visible.map((c) => (
                        <ClassCard
                            key={c.id}
                            data={c}
                            onToggleStar={() => toggleStar(c.id)}
                            layout={layout}
                            // Nếu ClassCard chưa có onOpen, bạn thêm vào ClassCard để click mở attendance:
                            onOpen={() => openAttendance(c.sessionId, c.sessionDate)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
