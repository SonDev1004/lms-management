// src/features/program/components/TrackCoursesDialog.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

// Hàm render trạng thái với màu sắc
const renderStatus = (c) => {
    const status = (c.statusName || "").toLowerCase();
    if (status.includes("đang")) return <Tag value={c.statusName} severity="info" rounded />;
    if (status.includes("đã") || status.includes("hoàn")) return <Tag value={c.statusName} severity="success" rounded />;
    if (status.includes("hủy")) return <Tag value={c.statusName} severity="danger" rounded />;
    return <Tag value={c.statusName || `#${c.status}`} severity="secondary" rounded />;
};

const TrackCoursesDialog = ({
                                visible = false,
                                track = null, // { code, label }
                                onHide = () => {},
                                onSelectCourse = () => {},
                                loadCourses, // async (track) => Course[]
                            }) => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function run() {
            if (!visible || !track) return;
            try {
                setLoading(true);
                const list = (await loadCourses?.(track)) ?? [];
                if (mounted) setCourses(Array.isArray(list) ? list : []);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        run();
        return () => {
            mounted = false;
        };
    }, [visible, track, loadCourses]);

    const header = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-calendar text-primary text-lg" />
            <span className="font-semibold text-lg">
        Danh sách lớp – {track?.label} ({track?.code})
      </span>
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={visible}
            modal
            style={{ width: "70rem", maxWidth: "95vw" }}
            onHide={onHide}
            className="p-fluid"
            footer={
                <Button label="Đóng" icon="pi pi-times" onClick={onHide} outlined severity="secondary" />
            }
        >
            {loading ? (
                <div className="flex flex-column gap-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height="2.2rem" borderRadius="12px" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="p-4 text-center text-600">⏳ Chưa có lớp cho lịch này.</div>
            ) : (
                <DataTable
                    value={courses}
                    size="small"
                    stripedRows
                    rowHover
                    dataKey="id"
                    className="shadow-1 border-round-lg"
                    paginator rows={5}
                >
                    <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: 60 }} />
                    <Column field="title" header="Tên lớp" sortable />
                    <Column
                        field="code"
                        header="Mã lớp"
                        sortable
                        style={{ width: 140 }}
                        body={(c) => c.code?.trim?.() || ""}
                    />
                    <Column
                        field="startDate"
                        header="Bắt đầu"
                        sortable
                        style={{ width: 130 }}
                        body={(c) => fmtDate(c.startDate)}
                    />
                    <Column field="schedule" header="Lịch học" />
                    <Column
                        field="sessions"
                        header="Số buổi"
                        style={{ width: 100 }}
                        body={(c) => c.sessions ?? 0}
                    />
                    <Column
                        field="capacity"
                        header="Sĩ số"
                        style={{ width: 100 }}
                        body={(c) => c.capacity ?? 0}
                    />
                    <Column header="Trạng thái" style={{ width: 160 }} body={renderStatus} />
                </DataTable>
            )}
        </Dialog>
    );
};

export default TrackCoursesDialog;
