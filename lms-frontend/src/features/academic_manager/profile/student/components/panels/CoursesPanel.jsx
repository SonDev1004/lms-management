import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

function statusSeverity(status) {
    const s = String(status || "").toLowerCase();
    if (["active", "running", "open", "ongoing"].includes(s)) return "success";
    if (["pending", "draft", "planned", "upcoming"].includes(s)) return "warning";
    if (["inactive", "closed", "ended", "completed"].includes(s)) return "secondary";
    return "info";
}

export default function CoursesPanel({ courses = [] }) {
    const statusBody = (row) => (
        <Tag value={row?.status || "UNKNOWN"} severity={statusSeverity(row?.status)} />
    );

    return (
        <div className="sp-card">
            <div className="sp-card-title">
        <span>
          <i className="pi pi-book sp-ic" /> Enrolled Courses
        </span>
            </div>

            <DataTable
                value={courses}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                emptyMessage="No courses"
                responsiveLayout="scroll"
            >
                <Column field="code" header="Code" sortable style={{ width: 160 }} />
                <Column field="title" header="Course" sortable />
                <Column field="startDate" header="Start date" sortable style={{ width: 180 }} />
                <Column header="Status" body={statusBody} style={{ width: 160 }} />
            </DataTable>
        </div>
    );
}
