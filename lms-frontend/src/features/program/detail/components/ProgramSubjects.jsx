import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { sessionsText, shortDate } from "../utils/format";
import CourseClassesDialog from "@/features/program/detail/components/CourseClassesDialog.jsx";
import "../styles/subjects-section.css";
import { parseCurrency } from "@/features/payment/utils/money.js";

/**
 * Map status from API -> UI status
 * Prefer statusCode (number), fallback to statusName (string)
 */
function getCourseStatusUI(statusCode, statusName) {
    // Prefer checking by status code (if provided)
    if (typeof statusCode === "number") {
        if (statusCode === 1 || statusCode === 2) {
            // SCHEDULED or ENROLLING
            return { text: "Enrolling", severity: "success", canRegister: true };
        }
        if (statusCode === 0) {
            // DRAFT
            return { text: "Not open yet", severity: "info", canRegister: false };
        }
        if (statusCode === 3) {
            // WAITLIST
            return { text: "Waitlist", severity: "warning", canRegister: false };
        }
        if (statusCode === 4 || statusCode === 5) {
            // IN_PROGRESS or COMPLETED
            return { text: "Closed", severity: "secondary", canRegister: false };
        }
    }

    // Fallback: check by text
    const s = String(statusName || "").toLowerCase().trim();

    // Vietnamese status names
    if (s === "đang tuyển sinh" || s === "sắp khai giảng") {
        return { text: "Enrolling", severity: "success", canRegister: true };
    }
    if (s === "đã kết thúc" || s === "đã hoàn thành" || s === "đang diễn ra") {
        return { text: "Closed", severity: "secondary", canRegister: false };
    }
    if (s === "chờ suất" || s === "waitlist") {
        return { text: "Waitlist", severity: "warning", canRegister: false };
    }
    if (s === "nháp") {
        return { text: "Not open yet", severity: "info", canRegister: false };
    }

    // English fallback
    const upper = s.toUpperCase();
    if (upper === "ENROLLING" || upper === "SCHEDULED") {
        return { text: "Enrolling", severity: "success", canRegister: true };
    }
    if (upper === "COMPLETED" || upper === "ENDED" || upper === "IN_PROGRESS") {
        return { text: "Closed", severity: "secondary", canRegister: false };
    }
    if (upper === "WAITLIST") {
        return { text: "Waitlist", severity: "warning", canRegister: false };
    }
    if (upper === "DRAFT") {
        return { text: "Not open yet", severity: "info", canRegister: false };
    }

    return { text: "Not open yet", severity: "info", canRegister: false };
}

export default function ProgramSubjects({ program }) {
    const navigate = useNavigate();

    const subjects = program?.subjects ?? [];
    const [dlgOpen, setDlgOpen] = useState(false);
    const [dlgLabel, setDlgLabel] = useState("");
    const [dlgRows, setDlgRows] = useState([]);

    const openClasses = (subject, course) => {
        // Map data into the format expected by CourseClassesDialog
        const rows = (course?.classes ?? []).map((x) => ({
            courseId: x.id,
            courseTitle: x.title || course.title,
            courseCode: x.code || course.code,
            startDate: x.startDate ? shortDate(x.startDate) : "",
            schedule: x.scheduleText || course.scheduleText || course.schedule || "",
            plannedSessions: x.sessions ?? course.sessions ?? "",
            capacity: typeof x.capacity === "number" ? x.capacity : course.capacity,
            status: x.status ?? course.status ?? 0,
            statusName: x.statusName || course.statusName || "Draft",
            trackCode: x.trackCode || course.trackCode || "",
        }));

        if (!rows.length) {
            rows.push({
                courseId: course.id,
                courseTitle: course.title,
                courseCode: course.code,
                startDate: course.startDate ? shortDate(course.startDate) : "",
                schedule: course.scheduleText || course.schedule || "",
                plannedSessions: course.sessions ?? "",
                capacity: course.capacity ?? "",
                status: course.status ?? 0,
                statusName: course.statusName || "Draft",
                trackCode: course.trackCode || "",
            });
        }

        setDlgLabel(`${course.title || course.code}`.trim());
        setDlgRows(rows);
        setDlgOpen(true);
    };

    const handleRegister = (subject, course) => {
        const trackCode = (course?.trackCode || "").trim();

        if (!program?.id) {
            alert("Missing ProgramId. Cannot proceed to payment.");
            return;
        }

        if (!trackCode) {
            alert("This schedule has no trackCode. Please choose another schedule or contact admin.");
            return;
        }

        const price = parseCurrency(program?.fee ?? program?.price ?? 0);

        const selectedItem = {
            type: "program",
            programId: program.id,
            subjectId: null,
            trackCode: trackCode,
            title: program?.title || "Program",
            price,
            meta: {
                selectedCourseId: course?.id ?? null,
                selectedCourseCode: course?.code ?? null,
                selectedSubjectId: subject?.id ?? null,
                selectedSubjectTitle: subject?.title ?? null,
            },
        };

        navigate("/payment", { state: { selectedItem } });
    };

    return (
        <div className="sc">
            <div className="subjects-card">
                <h3 className="section-title">Select Schedule</h3>

                {subjects.map((s, idx) => (
                    <details className="subject-panel" key={s.id || idx}>
                        <summary className="subject-summary">
                            <div className="subject-index">{idx + 1}</div>
                            <div className="subject-title">
                                <span>{s.title}</span>
                                {!!s.courses?.length && (
                                    <span className="pill">{s.courses.length} schedules</span>
                                )}
                            </div>
                            <div className="chevbox">
                                <i className="pi pi-chevron-down chev" />
                            </div>
                        </summary>

                        {(s.courses || []).map((c) => {
                            const statusUI = getCourseStatusUI(c.status, c.statusName);

                            return (
                                <div className="course-card" key={c.id}>
                                    <div className="course-row">
                                        <div className="course-title">
                                            <span>{c.displayName || c.name || c.code || c.title}</span>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "0.5rem",
                                                    alignItems: "center",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {c.code && <span className="tag">Schedule code: {c.code}</span>}
                                                <Tag value={statusUI.text} severity={statusUI.severity} rounded />
                                            </div>
                                        </div>
                                        <div className="actions">
                                            <Button
                                                icon="pi pi-search"
                                                label="View classes"
                                                outlined
                                                onClick={() => openClasses(s, c)}
                                            />
                                            <Button
                                                icon="pi pi-shopping-cart"
                                                label="Register"
                                                onClick={() => handleRegister(s, c)}
                                                disabled={!statusUI.canRegister}
                                                severity={statusUI.canRegister ? undefined : "secondary"}
                                            />
                                        </div>
                                    </div>

                                    <div className="meta">
                                        {c.startDate && (
                                            <span>
                                                <i className="pi pi-calendar" /> {shortDate(c.startDate)}
                                            </span>
                                        )}
                                        {(c.scheduleText || c.schedule) && (
                                            <span>
                                                <i className="pi pi-clock" /> {c.scheduleText || c.schedule}
                                            </span>
                                        )}
                                        {typeof c.capacity === "number" && (
                                            <span>
                                                <i className="pi pi-users" /> {c.capacity} seats
                                            </span>
                                        )}
                                        {c.sessions && (
                                            <span>
                                                <i className="pi pi-list" /> {sessionsText(c.sessions)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </details>
                ))}

                {!subjects.length && (
                    <div style={{ color: "var(--pg-muted)" }}>No schedules available.</div>
                )}
            </div>

            <CourseClassesDialog
                visible={dlgOpen}
                onHide={() => setDlgOpen(false)}
                title={dlgLabel}
                courses={dlgRows}
                onRegisterCourse={handleRegister}
            />
        </div>
    );
}
