import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

function mapCourseStatusToUi(statusName) {
    const s = String(statusName || "").toLowerCase().trim();

    if (s === "enrolling" || s === "waitlist") return "OPEN";
    if (s === "draft" || s === "scheduled") return "PENDING";
    if (s === "in_progress" || s === "completed" || s === "ended") return "CLOSED";

    return "PENDING";
}

const StatusTag = ({ statusName }) => {
    const ui = mapCourseStatusToUi(statusName);

    if (ui === "OPEN") return <Tag value="Open" severity="success" rounded />;
    if (ui === "CLOSED") return <Tag value="Closed" severity="secondary" rounded />;
    return <Tag value="Pending" severity="warning" rounded />;
};

const TrackCoursesDialog = ({
                                visible = false,
                                track = null,
                                onHide = () => {},
                                onSelectCourse = () => {},
                                loadCourses,
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
                Class list – {track?.trackLabel || track?.label} (
                {track?.trackCode || track?.code})
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
                <Button
                    label="Close"
                    icon="pi pi-times"
                    onClick={onHide}
                    outlined
                    severity="secondary"
                />
            }
        >
            {loading ? (
                <div className="flex flex-column gap-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height="2.2rem" borderRadius="12px" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="p-4 text-center text-600">
                    No classes available for this schedule.
                </div>
            ) : (
                <DataTable
                    value={courses}
                    size="small"
                    stripedRows
                    rowHover
                    dataKey="courseId"
                    paginator
                    rows={10}
                >
                    <Column header="#" body={(_, o) => o.rowIndex + 1} />
                    <Column field="courseTitle" header="Class name" sortable />
                    <Column field="courseCode" header="Class code" sortable />
                    <Column
                        field="startDate"
                        header="Start date"
                        body={(c) => fmtDate(c.startDate)}
                    />
                    <Column field="schedule" header="Schedule" />
                    <Column field="plannedSessions" header="Sessions" />
                    <Column field="capacity" header="Capacity" />
                    <Column
                        header="Status"
                        body={(row) => <StatusTag statusName={row.statusName} />}
                    />
                    <Column
                        header=""
                        body={(row) => (
                            <Button
                                label="Register"
                                icon="pi pi-shopping-cart"
                                size="small"
                                disabled={
                                    mapCourseStatusToUi(row.statusName) !== "OPEN"
                                }
                                onClick={() => onSelectCourse?.(row)}
                            />
                        )}
                    />
                </DataTable>
            )}
        </Dialog>
    );
};

export default TrackCoursesDialog;
