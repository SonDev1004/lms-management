import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

import SessionHeader from "../components/SessionHeader";
import WarningBanner from "../components/WarningBanner";
import RosterToolbar from "../components/RosterToolbar";
import RosterTable from "../components/RosterTable";

import { messagesPT } from "../mocks/sessionDetail";
import { studentsMock } from "../mocks/students";

import "../styles/attendance-detail.css";
import "../styles/roster.css";

const STORAGE_KEY = "att:detail:advanced-math";

export default function AttendanceDetailPage() {
    // ===== State =====
    const [students, setStudents] = useState(() => {
        const cached = localStorage.getItem(STORAGE_KEY);
        return cached ? JSON.parse(cached) : studentsMock;
    });
    const [selectedRow, setSelectedRow] = useState(0); // keyboard navigation
    const toast = useRef(null);

    // ===== Counters =====
    const counters = useMemo(() => {
        const agg = { P: 0, L: 0, A: 0, E: 0 };
        students.forEach((s) => (agg[s.status] = (agg[s.status] || 0) + 1));
        return agg;
    }, [students]);

    // ===== Bulk actions =====
    const markAll = (status = "P") => {
        setStudents((prev) =>
            prev.map((s) => ({
                ...s,
                status,
                lateMin: status === "L" ? s.lateMin ?? 5 : null,
                reason: ["A", "E", "L"].includes(status) ? s.reason : "",
            }))
        );
    };

    const invertSelection = () => {
        setStudents((prev) =>
            prev.map((s) => {
                // toggle only P <-> A; keep L/E as-is (phù hợp flow thực tế)
                if (s.status === "P") return { ...s, status: "A", lateMin: null, reason: "" };
                if (s.status === "A") return { ...s, status: "P", lateMin: null, reason: "" };
                return s;
            })
        );
    };

    const updateStudent = useCallback((id, patch) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    }, []);

    // ===== Keyboard shortcuts =====
    useEffect(() => {
        const onKey = (e) => {
            if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

            if (e.key === "ArrowDown") {
                setSelectedRow((r) => Math.min(r + 1, students.length - 1));
                e.preventDefault();
                return;
            }
            if (e.key === "ArrowUp") {
                setSelectedRow((r) => Math.max(r - 1, 0));
                e.preventDefault();
                return;
            }

            const current = students[selectedRow];
            if (!current) return;

            if (e.key === "1") updateStudent(current.id, { status: "P", lateMin: null, reason: "" });
            if (e.key === "2") updateStudent(current.id, { status: "L", lateMin: current.lateMin ?? 5 });
            if (e.key === "3") updateStudent(current.id, { status: "A", lateMin: null });
            if (e.key === "4") updateStudent(current.id, { status: "E", lateMin: null });
            if (e.key === "Enter") {
                const next = current.status === "P" ? "A" : "P";
                updateStudent(current.id, { status: next, lateMin: null, reason: "" });
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [students, selectedRow, updateStudent]);

    // ===== Persistence =====
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }, [students]);

    // ===== Actions =====
    const onSaveDraft = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        toast.current?.show({ severity: "success", summary: "Draft saved", life: 1500 });
    };

    const validate = () => {
        // Late requires minutes; Absent/Excused recommend reason
        const issues = [];
        students.forEach((s) => {
            if (s.status === "L" && (s.lateMin === null || s.lateMin === undefined))
                issues.push(`${s.name}: missing late minutes`);
            if (["A", "E"].includes(s.status) && !s.reason)
                issues.push(`${s.name}: missing reason`);
        });
        return issues;
    };

    const onSubmit = () => {
        const problems = validate();
        if (problems.length) {
            toast.current?.show({
                severity: "warn",
                summary: "Please complete required fields",
                detail: problems.slice(0, 4).join(" • "),
                life: 2500,
            });
            return;
        }
        // TODO: replace with real API call
        console.log("Submit attendance payload:", { records: students });
        toast.current?.show({ severity: "success", summary: "Attendance submitted", life: 1800 });
    };

    return (
        <div className="attd-shell">
            <Toast ref={toast} />

            {/* Header (Back pill, title, badge) */}
            <SessionHeader />

            {/* Session info cards + badge */}
            <div className="attd-stats-cards">
                <Card className="attd-stat">
                    <div className="attd-kv"><i className="pi pi-clock" /><span>Session Time</span></div>
                    <div className="attd-stat__value">09:00 AM - 10:30 AM</div>
                    <div className="attd-stat__hint">AM Session</div>
                </Card>

                <Card className="attd-stat">
                    <div className="attd-kv"><i className="pi pi-map-marker" /><span>Location</span></div>
                    <div className="attd-stat__value">Room 205</div>
                    <div className="attd-stat__hint">Main Campus</div>
                </Card>

                <Card className="attd-stat">
                    <div className="attd-kv"><i className="pi pi-users" /><span>Enrollment</span></div>
                    <div className="attd-stat__value">28 Students</div>
                    <div className="attd-stat__hint">Engineering • Advanced</div>
                </Card>

                <Card className="attd-stat">
                    <div className="attd-kv"><i className="pi pi-cog" /><span>Rules</span></div>
                    <div className="attd-stat__value">15 min</div>
                    <div className="attd-stat__hint">Grace Period</div>
                </Card>

                <div className="attd-session-badge">Session Ended</div>
            </div>

            {/* Warning bar */}
            <WarningBanner icon="pi pi-exclamation-triangle" text={messagesPT.sessionEnded} />

            {/* Main content (single column, centered) */}
            <div className="attd-content attd-single">
                <div className="attd-left">
                    <h2 className="attd-h2">Student Roster</h2>

                    <RosterToolbar
                        counters={counters}
                        total={students.length}
                        onMarkAllPresent={() => markAll("P")}
                        onInvert={invertSelection}
                    />

                    <RosterTable
                        students={students}
                        onChange={updateStudent}
                        selectedRow={selectedRow}
                        onSelectRow={setSelectedRow}
                    />

                    <div className="attd-actions">
                        <Button icon="pi pi-save" label="Save Draft" outlined className="mr-2" onClick={onSaveDraft} />
                        <Button icon="pi pi-send" label="Submit Attendance" onClick={onSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
}
