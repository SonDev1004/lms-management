import React, { useMemo, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../styles/dialog-forms.css";
const fmtVND = (v) =>
    (Number(v ?? 0)).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ProgramDetailDialog({ visible, onClose, program}) {
    const tracks = program?.tracks || [];
    const subjects = program?.subjects || [];

    const trackOptions = useMemo(() => {
        return [{ label: "All tracks", value: "__ALL__" }].concat(
            tracks.map((t) => ({ label: t.label || t.code, value: t.code }))
        );
    }, [tracks]);

    const [trackCode, setTrackCode] = useState("__ALL__");
    useEffect(() => {
        if (visible) setTrackCode("__ALL__");
    }, [visible]);

    const statusTag = (active) => (
        <Tag value={active ? "active" : "inactive"} severity={active ? "success" : "warning"} rounded />
    );

    const subjectCourses = (s) => {
        const rows = s?.courses || [];
        if (trackCode === "__ALL__") return rows;
        return rows.filter((c) => c.trackCode === trackCode);
    };

    const statusBody = (row) => (
        <Tag value={row.statusName || String(row.status ?? "")} severity="info" rounded />
    );

    return (
        <Dialog
            visible={visible}
            onHide={onClose}
            modal
            blockScroll
            className="dlg program-detail-dialog"
            style={{ width: "1400px", maxWidth: "96vw" }}
            breakpoints={{ "1400px": "92vw", "768px": "96vw" }}
            header={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{program?.title || "Program Detail"}</div>
                        <div style={{ fontSize: 13, opacity: 0.7 }}>
                            Code: <b>{program?.code || "-"}</b>
                        </div>
                    </div>
                    {statusTag(!!program?.isActive)}
                </div>
            }
        >
            {!program ? (
                <div style={{ padding: 12, opacity: 0.7 }}>No data.</div>
            ) : (
                <div style={{ display: "grid", gap: 14 }}>
                    {/* Summary */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "120px 1fr",
                            gap: 14,
                            border: "1px solid #eef2f7",
                            borderRadius: 14,
                            padding: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 120,
                                height: 90,
                                borderRadius: 12,
                                background: "#f6f7fb",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                color: "#6b7280",
                            }}
                        >
                            {program.image ? (
                                <img src={program.image} alt="program" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                "No image"
                            )}
                        </div>

                        <div style={{ display: "grid", gap: 8 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end" }}>
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>Tuition</div>
                                    <div style={{ fontWeight: 800 }}>{fmtVND(program.fee)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>Students</div>
                                    <div style={{ fontWeight: 800 }}>
                                        {program.minStudents ?? 0} - {program.maxStudents ?? 0}
                                    </div>
                                </div>

                                <div style={{ marginLeft: "auto", minWidth: 260 }}>
                                    <div style={{ fontSize: 12, opacity: 0.7 }}>Track filter</div>
                                    <Dropdown value={trackCode} options={trackOptions} onChange={(e) => setTrackCode(e.value)} className="w-full" />
                                </div>
                            </div>

                            <div>
                              <div style={{ fontSize: 12, opacity: 0.7 }}>Description</div>
                                <div>{program.description || "-"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Tracks */}
                    <div style={{ border: "1px solid #eef2f7", borderRadius: 14, padding: 12 }}>
                        <div style={{ fontWeight: 800, marginBottom: 10 }}>Tracks</div>
                        {tracks.length === 0 ? (
                            <div style={{ opacity: 0.7 }}>No tracks.</div>
                        ) : (
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                {tracks.map((t) => (
                                    <li key={t.code}>
                                        <b>{t.code}</b> — {t.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Subjects & Courses */}
                    <div style={{ border: "1px solid #eef2f7", borderRadius: 14, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ fontWeight: 800 }}>Subjects & Courses</div>
                            <div style={{ opacity: 0.7, fontSize: 13 }}>
                                Subjects: <b>{subjects.length}</b>
                            </div>
                        </div>

                        {subjects.length === 0 ? (
                            <div style={{ opacity: 0.7 }}>No subjects.</div>
                        ) : (
                            <Accordion multiple activeIndex={[0]}>
                                {subjects
                                    .slice()
                                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                    .map((s) => {
                                        const rows = subjectCourses(s);
                                        return (
                                            <AccordionTab
                                                key={s.id}
                                                header={
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                                                        <div style={{ fontWeight: 800 }}>{s.title}</div>
                                                        <Tag value={`Order: ${s.order ?? "-"}`} severity="info" rounded />
                                                        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
                                                            Courses: <b>{rows.length}</b>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <DataTable value={rows} responsiveLayout="stack" breakpoint="960px" emptyMessage="No courses in this track.">
                                                    <Column field="code" header="Course Code" style={{ minWidth: 160 }} />
                                                    <Column field="title" header="Course Title" style={{ minWidth: 220 }} />
                                                    <Column field="sessions" header="Planned" style={{ width: 110 }} />
                                                    <Column field="capacity" header="Capacity" style={{ width: 110 }} />
                                                    <Column header="Start date" body={(r) => (r.startDate ? String(r.startDate) : "-")} style={{ width: 130 }} />
                                                    <Column field="schedule" header="Schedule" style={{ minWidth: 200 }} />
                                                    <Column header="Status" body={statusBody} style={{ width: 140 }} />
                                                    <Column field="trackCode" header="Track" style={{ width: 160 }} />
                                                </DataTable>
                                            </AccordionTab>
                                        );
                                    })}
                            </Accordion>
                        )}
                    </div>
                </div>
            )}
        </Dialog>
    );
}
