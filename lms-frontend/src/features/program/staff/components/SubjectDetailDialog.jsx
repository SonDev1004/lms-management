import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";

import { getSubjectDetailP } from "@/features/subject/api/subjectService.js";

function fmtVND(v) {
    const n = Number(v ?? 0);
    return n.toLocaleString("vi-VN") + " đ";
}

export default function SubjectDetailDialog({ visible, onClose, subjectId }) {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        if (!visible || !subjectId) return;

        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const d = await getSubjectDetailP(subjectId, { onlyUpcoming: true });
                if (mounted) setDetail(d);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [visible, subjectId]);

    const header = useMemo(() => {
        if (!detail) return "Subject detail";
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {detail.title}
                    </div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>
                        Code: <b>{detail.code}</b>
                    </div>
                </div>
                <Tag
                    value={detail.isActive ? "active" : "inactive"}
                    severity={detail.isActive ? "success" : "warning"}
                    style={{ borderRadius: 999 }}
                />
            </div>
        );
    }, [detail]);

    const body = () => {
        if (loading) {
            return (
                <div style={{ display: "flex", justifyContent: "center", padding: 28 }}>
                    <ProgressSpinner style={{ width: 42, height: 42 }} />
                </div>
            );
        }
        if (!detail) return <div style={{ padding: 8 }}>No data.</div>;

        const min = detail.minStudent ?? detail.minStudents ?? 0;
        const max = detail.maxStudent ?? detail.maxStudents ?? 0;

        return (
            <div style={{ display: "grid", gap: 12 }}>
                <div className="p-card" style={{ padding: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Sessions</div>
                            <div style={{ fontWeight: 800 }}>{detail.sessionNumber ?? 0}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Fee</div>
                            <div style={{ fontWeight: 800 }}>{fmtVND(detail.fee)}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>Students</div>
                            <div style={{ fontWeight: 800 }}>{min} - {max}</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: 12 }}>ID</div>
                            <div style={{ fontWeight: 800 }}>{detail.id}</div>
                        </div>
                    </div>

                    <Divider />

                    <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 6 }}>Description</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{detail.description || "--"}</div>
                </div>

                <div className="p-card" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>Classes</div>

                    <DataTable
                        value={detail.classes || []}
                        emptyMessage="No classes."
                        responsiveLayout="stack"
                        breakpoint="960px"
                        rowHover
                    >
                        <Column field="code" header="Course Code" />
                        <Column field="title" header="Course Title" />
                        <Column field="plannedSessions" header="Planned" style={{ width: 120 }} />
                        <Column field="capacity" header="Capacity" style={{ width: 120 }} />
                        <Column field="startDate" header="Start date" style={{ width: 140 }} />
                        <Column field="schedule" header="Schedule" />
                        <Column field="statusName" header="Status" style={{ width: 140 }} />
                    </DataTable>
                </div>
            </div>
        );
    };

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onClose}
            modal
            style={{ width: "min(980px, 94vw)" }}
            contentStyle={{ overflow: "auto", maxHeight: "78vh" }}
            draggable={false}
            resizable={false}
        >
            {body()}
        </Dialog>
    );
}
