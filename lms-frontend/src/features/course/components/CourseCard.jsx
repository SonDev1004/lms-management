import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { toSlug } from "@/shared/lib/slugify.js";
import { formatDateISO } from "@/features/course/lib/formatters.js";
import CourseReminders from "./CourseReminders.jsx";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
    const navigate = useNavigate();
    const c = course;
    const slug = toSlug(c.title || c.subject || "khoa-hoc");

    const goDetail = (e) => {
        e?.stopPropagation?.();
        navigate(`/student/courses/${slug}?id=${c.id}&subjectId=${c._subjectId}`, { state: { course: c } });
    };
    const goMaterials = (e) => {
        e?.stopPropagation?.();
        navigate(`/student/courses/${slug}?id=${c.id}&subjectId=${c._subjectId}#materials`, { state: { course: c } });
    };

    const headerStyle = { background: c.subjectColor, color: c.accentText };

    const footer = (
        <div className="card-footer">
            <Button label="Documents" icon="pi pi-folder" className="footer-btn btn-tooltip btn-primary"
                data-pr-tooltip="Documents" aria-label={`Documents ${c.title}`} onClick={goMaterials} />
            <Button label="Details" icon="pi pi-info-circle" className="footer-btn btn-tooltip btn-secondary"
                data-pr-tooltip="Details" aria-label={`Details ${c.title}`} onClick={goDetail} />
        </div>
    );

    return (
        <Card
            className={`course-card ${c.clickable ? "clickable" : "disabled"}`}
            style={{ height: "100%", "--accent": c.subjectColor, "--accentText": c.accentText }}
            header={
                <div className="card-header" style={headerStyle}>
                    <div className="header-left">
                        <div className="title-wrap">
                            <h3 className="title" title={c.title} style={{ color: c.accentText }}>{c.title}</h3>
                            <p className="subtitle" style={{ color: c.accentText }}>{c.subject}</p>
                        </div>
                        <div className="header-meta" style={{ marginTop: 8, color: c.metaTextColor }}>
                            <div className="meta-row" style={{ background: c.metaBg }}>
                                <div className="meta-row meta-room" style={{ background: "transparent" }}>
                                    <i className="pi pi-home" aria-hidden="true" />
                                    <span className="meta-value">{c.room}</span>
                                </div>
                                <i className="pi pi-user" aria-hidden="true" />
                                <div className="meta-text">
                                    <strong className="meta-label">Teacher:</strong>
                                    <span className="meta-value meta-teacher">{c.teacher}</span>
                                </div>
                            </div>
                            <div className="meta-row" style={{ marginTop: 8, background: c.metaBg }}>
                                <i className="pi pi-clock" aria-hidden="true" />
                                <div className="meta-text">
                                    <span className="meta-value meta-schedule">{c.schedule || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="start-date" style={{ color: c.accentText }}>
                            Khai giảng: {formatDateISO(c.start_date)}
                        </div>
                    </div>
                </div>
            }
            footer={footer}
            onClick={goDetail}
            role="listitem"
            tabIndex={0}
            aria-label={`${c.subject} - ${c.title}`}
        >
            <div className="card-body fixed-layout">
                <div className="body-left">
                    <div className="desc-wrapper">
                        <div className="desc" role="region" aria-label={`Mô tả khóa ${c.title}`}>{c.description}</div>
                        <div className="reminders">
                            <strong>Reminder / Homework</strong>
                            <CourseReminders reminders={c.reminders} />
                        </div>
                    </div>
                </div>
                <div className="body-right">
                    <div className="info-row">
                        <div><strong>Session:</strong> <span className="muted">{c.attended_sessions}/{c.session_number}</span></div>
                    </div>
                    <div className={`status-pill ${c.clickable ? "active" : c.hasFinished ? "finished" : "upcoming"}`} style={{ marginTop: 12 }}>
                        {c.clickable ? "Ongoing" : c.hasFinished ? "Completed" : "Upcoming"}
                    </div>
                </div>
            </div>
        </Card>
    );
}
