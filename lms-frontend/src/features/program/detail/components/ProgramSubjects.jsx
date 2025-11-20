import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { sessionsText, shortDate } from "../utils/format";
import CourseClassesDialog from "@/features/program/detail/components/CourseClassesDialog.jsx";
import "../styles/subjects-section.css";
import {parseCurrency} from "@/features/payment/utils/money.js";

export default function ProgramSubjects({ program }) {
    const navigate = useNavigate();

    const subjects = program?.subjects ?? [];
    const [dlgOpen, setDlgOpen] = useState(false);
    const [dlgLabel, setDlgLabel] = useState("");
    const [dlgRows, setDlgRows] = useState([]);

    const openClasses = (subject, course) => {
        const rows = (course?.classes ?? []).map((x) => ({
            id: x.id,
            title: x.title || course.title,
            code: x.code || course.code,
            startDate: x.startDate ? shortDate(x.startDate) : "",
            scheduleText: x.scheduleText || course.scheduleText || "",
            sessions: x.sessions ?? course.sessions ?? "",
            capacity: typeof x.capacity === "number" ? x.capacity : course.capacity,
            status: (x.status || course.status || "upcoming").toLowerCase(),
        }));

        if (!rows.length) {
            rows.push({
                id: course.id,
                title: course.title,
                code: course.code,
                startDate: course.startDate ? shortDate(course.startDate) : "",
                scheduleText: course.scheduleText || "",
                sessions: course.sessions ?? "",
                capacity: course.capacity ?? "",
                status: (course.status || "upcoming").toLowerCase(),
            });
        }

        setDlgLabel(`${course.title || course.code} (${course.code || ""})`.trim());
        setDlgRows(rows);
        setDlgOpen(true);
    };

    // ---- navigate to payment
    const handleRegister = (subject, course) => {
        const rawPrice =
            course?.price ?? course?.fee ?? course?.tuition ??
            subject?.price ?? subject?.fee ??
            program?.fee ?? program?.price ?? 0;

        const price = parseCurrency(rawPrice);

        const selectedItem = {
            type: 'subject',
            programId: program?.id ?? null,
            subjectId: subject?.id ?? null,
            title: course?.displayName || course?.name || course?.title || subject?.title || 'Course',
            price,                                   // 👈 số thô
            meta: {
                subject: {
                    id: subject?.id,
                    code: subject?.code || course?.subjectCode,
                    sessionNumber: course?.sessions ?? subject?.sessions ?? null,
                    title: subject?.title,
                },
                class: {
                    id: course?.id,
                    schedule: course?.scheduleText || '',
                    startDate: course?.startDate || null,
                    capacity: typeof course?.capacity === 'number' ? course.capacity : null,
                    statusName: course?.statusName || course?.status || 'Upcoming',
                },
            },
        };

        navigate('/payment', { state: { selectedItem } });
    };

    return (
        <div className="sc">
            <div className="subjects-card">
                <h3 className="section-title">Chọn Lịch Học</h3>

                {subjects.map((s, idx) => (
                    <details className="subject-panel" key={s.id || idx}>
                        <summary className="subject-summary">
                            <div className="subject-index">{idx + 1}</div>
                            <div className="subject-title">
                                <span>{s.title}</span>
                                {!!s.courses?.length && (
                                    <span className="pill">{s.courses.length} lịch</span>
                                )}
                            </div>
                            <div className="chevbox">
                                <i className="pi pi-chevron-down chev" />
                            </div>
                        </summary>

                        {(s.courses || []).map((c) => (
                            <div className="course-card" key={c.id}>
                                <div className="course-row">
                                    <div className="course-title">
                                        <span>{c.displayName || c.name || c.code || c.title}</span>
                                        {c.code && <span className="tag">Mã lịch: {c.code}</span>}
                                    </div>
                                    <div className="actions">
                                        <Button
                                            icon="pi pi-search"
                                            label="Xem lớp"
                                            outlined
                                            onClick={() => openClasses(s, c)}
                                        />
                                        <Button
                                            icon="pi pi-shopping-cart"
                                            label="Đăng ký"
                                            onClick={() => handleRegister(s, c)}
                                        />
                                    </div>
                                </div>

                                <div className="meta">
                                    {c.startDate && (
                                        <span>
                                            <i className="pi pi-calendar" /> {shortDate(c.startDate)}
                                        </span>
                                    )}
                                    {c.scheduleText && (
                                        <span>
                                            <i className="pi pi-clock" /> {c.scheduleText}
                                        </span>
                                    )}
                                    {typeof c.capacity === "number" && (
                                        <span>
                                            <i className="pi pi-users" /> {c.capacity} chỗ
                                        </span>
                                    )}
                                    {c.sessions && (
                                        <span>
                                            <i className="pi pi-list" /> {sessionsText(c.sessions)} buổi
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </details>
                ))}

                {!subjects.length && (
                    <div style={{ color: "var(--pg-muted)" }}>Chưa có lịch học.</div>
                )}
            </div>

            {/* Dialog */}
            <CourseClassesDialog
                visible={dlgOpen}
                onHide={() => setDlgOpen(false)}
                courseLabel={dlgLabel}
                rows={dlgRows}
            />
        </div>
    );
}
