import React, { useMemo } from "react";
import { Tag } from "primereact/tag";
import ContactCard from "../ContactCard.jsx";

function statusSeverity(status) {
    const s = String(status || "").toLowerCase();
    if (["active", "running", "open", "ongoing"].includes(s)) return "success";
    if (["pending", "draft", "planned", "upcoming"].includes(s)) return "warning";
    if (["inactive", "closed", "ended", "completed"].includes(s)) return "secondary";
    return "info";
}

export default function OverviewPanel({ courses = [] }) {
    const stats = useMemo(() => {
        const total = courses.length;
        const byStatus = {};
        for (const c of courses) {
            const k = (c.status || "UNKNOWN").toString();
            byStatus[k] = (byStatus[k] || 0) + 1;
        }
        return { total, byStatus };
    }, [courses]);

    return (
        <div className="sp-grid">
            <div className="sp-card">
                <div className="sp-card-title">
          <span>
            <i className="pi pi-chart-bar sp-ic" /> Overview
          </span>
                </div>

                <div className="grid">
                    <div className="col-12 md:col-4">
                        <div className="text-500">Total courses</div>
                        <div style={{ fontSize: 26, fontWeight: 800 }}>{stats.total}</div>
                    </div>

                    <div className="col-12 md:col-8">
                        <div className="text-500">By status</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(stats.byStatus).map(([k, v]) => (
                                <Tag key={k} value={`${k}: ${v}`} severity={statusSeverity(k)} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="text-500 mb-2">Recent courses</div>
                    <div style={{ display: "grid", gap: 10 }}>
                        {courses.slice(0, 5).map((c) => (
                            <div key={c.courseId ?? c.code} className="p-2" style={{ border: "1px solid #eef2f7", borderRadius: 10 }}>
                                <div style={{ fontWeight: 700 }}>{c.title || "--"}</div>
                                <div className="text-500" style={{ marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span>
                    <b>Code:</b> {c.code || "--"}
                  </span>
                                    <span>
                    <b>Start:</b> {c.startDate || "--"}
                  </span>
                                    <span>
                    <b>Status:</b> {c.status || "--"}
                  </span>
                                </div>
                            </div>
                        ))}
                        {!courses.length && <div className="text-500">No courses.</div>}
                    </div>
                </div>
            </div>

            <ContactCard />
        </div>
    );
}
