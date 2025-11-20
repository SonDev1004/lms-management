import { useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

import { classesMock } from "../mocks/classes";
import StatCard from "../components/StatCard";
import ControlsBar from "../components/ControlsBar";
import SectionTabs from "../components/SectionTabs";
import ClassCard from "../components/ClassCard";

import "../styles/attendance.css";

export default function AttendancePage() {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("today");
    const [layout, setLayout] = useState("list");
    const [items, setItems] = useState(classesMock);

    const stats = useMemo(() => {
        const today = items.filter((i) => i.isToday);
        const totalClasses = today.length;
        const inProgress = items.filter((i) => i.status === "In Progress").length;
        const totalStudents = items.reduce((s, c) => s + (c.enrolled || 0), 0);
        const attValues = items.filter((i) => typeof i.attendanceRate === "number");
        const avgAttendance =
            attValues.length === 0 ? 0 : Math.round(attValues.reduce((s, c) => s + c.attendanceRate, 0) / attValues.length);
        return { totalClasses, inProgress, totalStudents, avgAttendance };
    }, [items]);

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
            [c.title, c.code, c.location, c.campus, c.level, ...(c.tags || [])].join(" ").toLowerCase().includes(q)
        );
    }, [filteredByTab, query]);

    const toggleStar = (id) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, starred: !it.starred } : it)));
    };

    return (
        <div className="att-shell">
            <div className="att-header">
                <div className="att-title">
                    <h1>Class Attendance</h1>
                    <p>Manage attendance for your classes today</p>
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

            <div className="att-stats">
                <StatCard title="Total Classes" value={stats.totalClasses} icon="pi pi-calendar" tone="neutral" />
                <StatCard title="In Progress" value={stats.inProgress} icon="pi pi-clock" tone="neutral" />
                <StatCard title="Total Students" value={stats.totalStudents} icon="pi pi-users" tone="students" />
                <StatCard title="Avg Attendance" value={`${stats.avgAttendance}%`} icon="pi pi-chart-line" tone="success" withTrend />
            </div>

            <div className="att-toolbar">
        <span className="p-input-icon-left att-search">
          <i className="pi pi-search" />
          <InputText
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by subject, code, or teacher..."
          />
        </span>
                <ControlsBar layout={layout} onLayoutChange={setLayout} onFilter={() => {}} />
            </div>

            <SectionTabs active={activeTab} onChange={setActiveTab} />

            {visible.length === 0 ? (
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
                        <ClassCard key={c.id} data={c} onToggleStar={() => toggleStar(c.id)} layout={layout} />
                    ))}
                </div>
            )}
        </div>
    );
}
