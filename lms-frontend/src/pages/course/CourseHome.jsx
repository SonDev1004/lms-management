// src/pages/course/CourseHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import "./CourseHome.css";

import StudentService from "services/studentService.js";
import {
    getCourseThemeStable
} from "utils/colorsCourseCard.js";
import { toSlug } from "utils/slugify.js";


function splitSchedule(raw) {
    if (!raw) return [];
    return String(raw)
        .split(/\s*\/\s*/g)            // tách theo dấu "/"
        .map(p => p.replace(/-/g, "–") // đổi "-" thành "–" (en dash)
            .trim())
        .filter(Boolean);
}
function classifyReminder(text) {
  if (!text) return "normal";
  const t = text.toLowerCase();
  if (/(hoàn thành|nộp|deadline|bài thi|gấp|urgent|submit|due)/i.test(t))
    return "urgent";
  if (/(chuẩn bị|prepare|presentation|agenda|chuẩn bị)/i.test(t))
    return "prepare";
  if (/(ôn tập|ôn|ôn từ|review|practice|luyện)/i.test(t)) return "review";
  return "normal";
}

const reminderIcons = {
  urgent: { emoji: "⏰", label: "Deadline" },
  prepare: { emoji: "📝", label: "Chuẩn bị" },
  review: { emoji: "📖", label: "Ôn tập" },
  normal: { emoji: "🔔", label: "Nhắc" },
};

function formatDateISO(isoString) {
  if (!isoString) return "-";
  const d = isoString instanceof Date ? isoString : new Date(isoString);
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function CourseHome() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Lấy dữ liệu
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    StudentService.getMyCourses()
      .then((data) => {
        if (mounted) setCourses(data);
      })
      .catch((e) => {
        if (mounted) setError(e);
        console.error(e);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const now = useMemo(() => new Date(), []);

  // Tính toán UI + theme màu cho từng course
    const uiCourses = useMemo(
        () =>
            courses.map((c) => {
                const theme = getCourseThemeStable(c); // <- luôn ổn định theo id/title

                const startDate = c.start_date ? new Date(c.start_date) : null;
                const hasStarted = startDate ? now >= startDate : false;
                const hasFinished = startDate ? now > startDate && !c.is_active : false;
                const clickable = Boolean(c.is_active && hasStarted && !hasFinished);

                return {
                    ...c,
                    subjectColor: theme.accent,
                    accentText: theme.accentText,
                    metaTextColor: theme.metaTextColor,
                    metaBg: theme.metaBg,
                    startDate, hasStarted, hasFinished, clickable,
                };
            }),
        [courses, now]
    );
  const counts = useMemo(
    () => ({
      "Tất cả": uiCourses.length,
      "Đang học": uiCourses.filter((c) => c.clickable).length,
      "Sắp mở": uiCourses.filter((c) => !c.hasStarted).length,
      "Đã học": uiCourses.filter((c) => c.hasFinished).length,
    }),
    [uiCourses],
  );

  const visible = useMemo(() => {
    if (filter === "Tất cả") return uiCourses;
    if (filter === "Đang học") return uiCourses.filter((c) => c.clickable);
    if (filter === "Sắp mở") return uiCourses.filter((c) => !c.hasStarted);
    if (filter === "Đã học") return uiCourses.filter((c) => c.hasFinished);
    return uiCourses;
  }, [uiCourses, filter]);

  const handleKeyActivate = (e, c) => {
    if (["Enter", " ", "Spacebar"].includes(e.key)) {
      e.preventDefault();
      const slug = toSlug(c.title || c.subject || "khoa-hoc");
      navigate(`/student/courses/${slug}?id=${c.id}`);
    }
  };

  return (
    <div className="course-wrapper p-d-flex p-flex-column">
      <div className="controls" style={{ padding: "0 16px" }}>
        <div
          className="filter-bar"
          role="toolbar"
          aria-label="Bộ lọc trạng thái lớp"
        >
          {["Tất cả", "Đang học", "Sắp mở", "Đã học"].map((opt) => (
            <button
              key={opt}
              className={`filter-btn ${filter === opt ? "is-active" : ""}`}
              onClick={() => setFilter(opt)}
              aria-pressed={filter === opt}
              aria-label={`${opt} (${counts[opt] ?? 0})`}
            >
              <span className="filter-label">{opt}</span>
              <span className="filter-count">({counts[opt] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="course-grid" role="list" aria-live="polite">
        <Tooltip
          target=".btn-tooltip"
          position="top"
          mouseTrack
          mouseTrackLeft={10}
        />

        {loading && <div className="skeleton">Đang tải khoá học…</div>}
        {!loading && error && (
          <div className="error">Không tải được danh sách khoá học.</div>
        )}
        {!loading && !error && visible.length === 0 && (
          <div className="empty">Bạn chưa có khoá học nào.</div>
        )}

        {!loading &&
          !error &&
          visible.length > 0 &&
          visible.map((c) => {
            const accent = c.subjectColor;
            const accentText = c.accentText;
            const metaTextColor = c.metaTextColor;
            const metaBg = c.metaBg;
            const headerStyle = { background: accent, color: accentText };

            const slug = toSlug(c.title || c.subject || "khoa-hoc");
            const goDetail = (e) => {
              e?.stopPropagation?.();
              navigate(`/student/courses/${slug}?id=${c.id}`);
            };
            const goMaterials = (e) => {
              e?.stopPropagation?.();
              navigate(`/student/courses/${slug}?id=${c.id}#materials`);
            };

              const footer = (
                  <div className="card-footer">
                      <Button
                          label="Tài liệu"
                          icon="pi pi-folder"
                          className="footer-btn btn-tooltip btn-primary"
                          data-pr-tooltip="Tài liệu"
                          aria-label={`Tài liệu ${c.title}`}
                          onClick={goMaterials}
                      />
                      <Button
                          label="Chi tiết"
                          icon="pi pi-info-circle"
                          className="footer-btn btn-tooltip btn-secondary"
                          data-pr-tooltip="Chi tiết"
                          aria-label={`Chi tiết ${c.title}`}
                          onClick={goDetail}
                      />
                  </div>
              );

            return (
              <Card
                key={c.id}
                className={`course-card ${c.clickable ? "clickable" : "disabled"}`}
                style={{ height: "100%", "--accent": accent, "--accentText": accentText }}                header={
                  <div className="card-header" style={headerStyle}>
                    <div className="header-left">
                      <div className="title-wrap">
                        <h3
                          className="title"
                          title={c.title}
                          style={{ color: accentText }}
                        >
                          {c.title}
                        </h3>
                        <p className="subtitle" style={{ color: accentText }}>
                          {c.subject}
                        </p>
                      </div>

                      <div
                        className="header-meta"
                        style={{ marginTop: 8, color: metaTextColor }}
                      >
                        <div
                          className="meta-row"
                          style={{ background: metaBg }}
                        >  <div
                            className="meta-row meta-room"
                            style={{ background: "transparent" }}
                        >
                            <i className="pi pi-home" aria-hidden="true" />
                            <span className="meta-value">{c.room}</span>
                        </div>
                          <i className="pi pi-user" aria-hidden="true" />
                          <div className="meta-text">
                            <strong className="meta-label">GV:</strong>
                            <span className="meta-value meta-teacher">
                              {c.teacher}
                            </span>
                          </div>
                        </div>

                        <div
                          className="meta-row"
                          style={{ marginTop: 8, background: metaBg }}
                        >
                          <i className="pi pi-clock" aria-hidden="true" />
                          <div className="meta-text">
                            <span className="meta-value meta-schedule">
                              {c.schedule || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="header-right">
                      <div className="start-date" style={{ color: accentText }}>
                        Khai giảng: {formatDateISO(c.start_date)}
                      </div>
                    </div>
                  </div>
                }
                footer={footer}
                onClick={() => navigate(`/student/courses/${slug}?id=${c.id}`)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => handleKeyActivate(e, c)}
                aria-label={`${c.subject} - ${c.title}`}
              >
                <div className="card-body fixed-layout">
                  <div className="body-left">
                    <div className="desc-wrapper">
                      <div
                        className="desc"
                        role="region"
                        aria-label={`Mô tả khóa ${c.title}`}
                      >
                        {c.description}
                      </div>

                      <div className="reminders">
                        <strong>Nhắc nhở / Bài tập</strong>
                        <ul className="reminder-list" aria-live="polite">
                          {c.reminders && c.reminders.length ? (
                            c.reminders.map((r, idx) => {
                              const kind = classifyReminder(r);
                              const ic =
                                reminderIcons[kind] || reminderIcons.normal;
                              return (
                                <li
                                  className={`reminder-item reminder-${kind}`}
                                  key={idx}
                                  title={r}
                                >
                                  <span
                                    className="reminder-icon"
                                    role="img"
                                    aria-label={ic.label}
                                  >
                                    {ic.emoji}
                                  </span>
                                  <span className="reminder-text">{r}</span>
                                </li>
                              );
                            })
                          ) : (
                            <li className="reminder-item reminder-normal">
                              Không có nhắc nhở
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="body-right">
                    <div className="info-row">
                      <div>
                        <strong>Buổi:</strong>{" "}
                        <span className="muted">
                          {" "}
                          {c.attended_sessions}/{c.session_number}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`status-pill ${
                        c.clickable
                          ? "active"
                          : c.hasFinished
                            ? "finished"
                            : "upcoming"
                      }`}
                      style={{ marginTop: 12 }}
                    >
                      {c.clickable
                        ? "Đang học"
                        : c.hasFinished
                          ? "Đã học"
                          : "Sắp khai giảng"}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
