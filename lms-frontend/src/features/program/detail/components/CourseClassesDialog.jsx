import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

/**
 * Map CourseStatus (BE) -> registration status (UI)
 * Updated to handle Vietnamese status names from API
 */
function mapCourseStatusToUi(statusName, statusCode) {
    // Prefer checking by status code (if provided)
    if (typeof statusCode === "number") {
        if (statusCode === 1 || statusCode === 2) return "OPEN";      // SCHEDULED or ENROLLING
        if (statusCode === 0) return "PENDING";                       // DRAFT
        if (statusCode === 4 || statusCode === 5) return "CLOSED";    // IN_PROGRESS or COMPLETED
        if (statusCode === 3) return "WAITLIST";                      // WAITLIST
    }

    // Fallback: check by text
    const s = String(statusName || "").toLowerCase().trim();

    // Vietnamese status names
    if (s === "đang tuyển sinh" || s === "sắp khai giảng") return "OPEN";
    if (s === "nháp") return "PENDING";
    if (s === "đang diễn ra" || s === "đã hoàn thành" || s === "đã kết thúc") return "CLOSED";

    // Fallback for English status names
    const upper = s.toUpperCase();
    if (upper === "ENROLLING" || upper === "WAITLIST") return "OPEN";
    if (upper === "DRAFT" || upper === "SCHEDULED") return "PENDING";
    if (upper === "IN_PROGRESS" || upper === "COMPLETED" || upper === "ENDED") return "CLOSED";

    return "PENDING";
}

const StatusTag = ({ statusName, statusCode }) => {
    const ui = mapCourseStatusToUi(statusName, statusCode);

    if (ui === "OPEN") return <Tag value="Open" severity="success" rounded />;
    if (ui === "CLOSED") return <Tag value="Closed" severity="secondary" rounded />;
    if (ui === "WAITLIST") return <Tag value="Waitlist" severity="warning" rounded />;
    return <Tag value="Pending" severity="warning" rounded />;
};

export default function CourseClassesDialog({
                                                visible,
                                                onHide,
                                                courses = [],
                                                title,
                                            }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!visible) return;
        setRows(courses || []);
    }, [visible, courses]);

    return (
        <Dialog
            header={title || "Class List"}
            visible={visible}
            style={{ width: "90vw", maxWidth: "960px" }}
            modal
            onHide={onHide}
        >
            <DataTable value={rows} paginator rows={10} emptyMessage="No classes found">
                <Column header="#" body={(_, o) => o.rowIndex + 1} style={{ width: 60 }} />
                <Column field="courseTitle" header="Class name" />
                <Column field="courseCode" header="Class code" />
                <Column field="startDate" header="Start date" />
                <Column field="schedule" header="Schedule" />
                <Column field="plannedSessions" header="Sessions" />
                <Column field="capacity" header="Capacity" />
                <Column
                    header="Status"
                    body={(row) => (
                        <StatusTag statusName={row.statusName} statusCode={row.status} />
                    )}
                />
            </DataTable>
        </Dialog>
    );
}
