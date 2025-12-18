import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { sessionsText, shortDate } from "../utils/format";
import CourseClassesDialog from "@/features/program/detail/components/CourseClassesDialog.jsx";
import "../styles/subjects-section.css";
import { parseCurrency } from "@/features/payment/utils/money.js";

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
            scheduleText: x.scheduleText || course.scheduleText || course.schedule || "",
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
                scheduleText: course.scheduleText || course.schedule || "",
                sessions: course.sessions ?? "",
                capacity: course.capacity ?? "",
                status: (course.statusName || course.status || "upcoming").toLowerCase(),
            });
        }

        setDlgLabel(`${course.title || course.code} (${course.code || ""})`.trim());
        setDlgRows(rows);
        setDlgOpen(true);
    };

    /**
     * ĐĂNG KÝ = MUA PROGRAM THEO TRACK
     * - Bắt buộc có trackCode (lấy từ course.trackCode).
     * - PaymentPage sẽ gọi /create-payment với programId + trackCode
     * - BE callback SUCCESS sẽ auto insert course_student cho toàn bộ courses thuộc track
     */
    const handleRegister = (subject, course) => {
        const trackCode = (course?.trackCode || "").trim();

        if (!program?.id) {
            alert("ProgramId bị thiếu, không thể thanh toán.");
            return;
        }

        if (!trackCode) {
            alert("Lịch học này chưa có trackCode. Vui lòng chọn lịch khác hoặc liên hệ admin.");
            return;
        }

        // Mua chương trình => giá phải là program.fee
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
                <h3 className="section-title">Chọn Lịch Học</h3>

                {subjects.map((s, idx) => (
                    <details className="subject-panel" key={s.id || idx}>
                        <summary className="subject-summary">
                            <div className="subject-index">{idx + 1}</div>
                            <div className="subject-title">
                                <span>{s.title}</span>
                                {!!s.courses?.length && <span className="pill">{s.courses.length} lịch</span>}
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
                                    {(c.scheduleText || c.schedule) && (
                                        <span>
                                            <i className="pi pi-clock" /> {c.scheduleText || c.schedule}
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

                {!subjects.length && <div style={{ color: "var(--pg-muted)" }}>Chưa có lịch học.</div>}
            </div>

            <CourseClassesDialog
                visible={dlgOpen}
                onHide={() => setDlgOpen(false)}
                courseLabel={dlgLabel}
                rows={dlgRows}
            />
        </div>
    );
}
