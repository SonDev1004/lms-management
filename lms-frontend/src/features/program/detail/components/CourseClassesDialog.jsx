import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function StatusPill({ value }) {
    const s = String(value || "").toLowerCase();
    const map = {
        open: { text: "Đang tuyển sinh", cls: "bg-teal-100 text-teal-700" },
        upcoming: { text: "Sắp khai giảng", cls: "bg-cyan-100 text-cyan-700" },
        pending: { text: "Chờ mở", cls: "bg-gray-100 text-gray-700" },
    };
    const m = map[s] || map.pending;
    return <span className={`px-3 py-1 rounded-full text-sm ${m.cls}`}>{m.text}</span>;
}

export default function CourseClassesDialog({
                                                visible,
                                                onHide,
                                                courseLabel,        // ví dụ: "IELTS-2025-A (IELTS-2025-A)"
                                                rows = [],          // [{id,title,code,startDate,scheduleText,sessions,capacity,size,status}]
                                            }) {
    return (
        <Dialog
            header={<div className="flex items-center gap-2">
                <i className="pi pi-calendar" />
                <span>Danh sách lớp – {courseLabel}</span>
            </div>}
            visible={visible}
            onHide={onHide}
            style={{ width: "90vw", maxWidth: 1080 }}
            draggable={false}
            dismissableMask
        >
            <DataTable
                value={rows}
                paginator rows={10}
                emptyMessage="Chưa có lớp."
                stripedRows
                size="large"
                rowNumberMode="static"
            >
                <Column header="#" body={(_, opt) => opt.rowIndex + 1} style={{ width: 70 }} />
                <Column field="title" header="Tên lớp" sortable />
                <Column field="code" header="Mã lớp" sortable style={{ width: 220 }} />
                <Column field="startDate" header="Bắt đầu" sortable style={{ width: 140 }} />
                <Column field="scheduleText" header="Lịch học" />
                <Column field="sessions" header="Số buổi" sortable style={{ width: 110 }} />
                <Column field="capacity" header="Sĩ số" sortable style={{ width: 110 }} />
                <Column
                    field="status"
                    header="Trạng thái"
                    body={(r) => <StatusPill value={r.status} />}
                    style={{ width: 170 }}
                />
            </DataTable>

        </Dialog>
    );
}
