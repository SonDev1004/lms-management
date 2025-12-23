import React, { useMemo, useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

/**
 * Props:
 * - student: object
 * - courses: [{ courseId, code, title }]
 * - overview: { present, late, absent, excused, rate|attendanceRate }
 * - details: [{ date, startTime, endTime, courseTitle, attendance, statusText, note }]
 * - selectedCourseId?: number|string
 * - onCourseChange?: (courseId) => void
 * - loading?: boolean
 */
export default function AttendancePanel({
                                            student,
                                            courses = [],
                                            overview,
                                            details = [],
                                            selectedCourseId,
                                            onCourseChange,
                                            loading = false,
                                        }) {
    const options = useMemo(() => {
        return (courses || [])
            .filter((c) => c?.courseId != null)
            .map((c) => ({
                label: `${c.code || ""}${c.code ? " - " : ""}${c.title || ""}`.trim() || `Course #${c.courseId}`,
                value: c.courseId,
            }));
    }, [courses]);

    // nếu parent không truyền selectedCourseId thì panel tự giữ state nội bộ
    const [localCourseId, setLocalCourseId] = useState(() => options[0]?.value ?? null);

    useEffect(() => {
        if (selectedCourseId != null) return;
        if (localCourseId != null) return;
        if (options[0]?.value != null) setLocalCourseId(options[0].value);
    }, [options, selectedCourseId, localCourseId]);

    const courseId = selectedCourseId ?? localCourseId;

    const present = Number(overview?.present ?? 0);
    const late = Number(overview?.late ?? 0);
    const absent = Number(overview?.absent ?? 0);
    const excused = Number(overview?.excused ?? 0);

    const rate = Number(overview?.attendanceRate ?? overview?.rate ?? 0);

    const statusTemplate = (row) => {
        const st = row?.attendance;
        let value = row?.statusText || "Not recorded";
        let severity = "info";

        if (st === 1) {
            value = row?.statusText || "Present";
            severity = "success";
        } else if (st === 2) {
            value = row?.statusText || "Late";
            severity = "warning";
        } else if (st === 0) {
            value = row?.statusText || "Absent";
            severity = "danger";
        } else if (st === 3) {
            value = row?.statusText || "Excused";
            severity = "info";
        }

        return <Tag value={value} severity={severity} />;
    };

    const timeTemplate = (row) => {
        const start = row?.startTime?.slice?.(0, 5) ?? "";
        const end = row?.endTime?.slice?.(0, 5) ?? "";
        return start || end ? `${start} - ${end}` : "";
    };

    const courseTitleTemplate = (row) => row?.courseTitle ?? row?.courseCode ?? "";

    const handleCourseChange = (nextId) => {
        if (onCourseChange) onCourseChange(nextId);
        else setLocalCourseId(nextId);
    };

    const exportCsv = () => {
        const rows = (details || []).map((r) => ({
            date: r?.date ?? "",
            time: `${(r?.startTime || "").toString().slice(0, 5)}-${(r?.endTime || "").toString().slice(0, 5)}`,
            course: r?.courseTitle ?? "",
            attendance: r?.statusText ?? r?.attendance ?? "",
            note: r?.note ?? "",
        }));

        const header = ["date", "time", "course", "attendance", "note"];
        const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
        const csv = [header.join(","), ...rows.map((x) => header.map((h) => esc(x[h])).join(","))].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_course_${courseId || "unknown"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <Card>
                <div className="flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Attendance Overview</div>
                        <div className="text-500" style={{ marginTop: 4 }}>
                            {student?.firstName || student?.lastName
                                ? `${student?.firstName ?? ""} ${student?.lastName ?? ""}`.trim()
                                : student?.userName ?? ""}
                        </div>
                    </div>

                    <div style={{ minWidth: 320 }}>
                        <Dropdown
                            value={courseId}
                            options={options}
                            onChange={(e) => handleCourseChange(e.value)}
                            placeholder="Select course"
                            disabled={!options.length || loading}
                            className="w-full"
                            showClear={false}
                        />
                    </div>
                </div>

                <div className="grid mt-3">
                    <div className="col-12 md:col-3">
                        <div className="text-500">Present</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{present}</div>
                    </div>
                    <div className="col-12 md:col-3">
                        <div className="text-500">Late</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{late}</div>
                    </div>
                    <div className="col-12 md:col-3">
                        <div className="text-500">Absent</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{absent}</div>
                    </div>
                    <div className="col-12 md:col-3">
                        <div className="text-500">Excused</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{excused}</div>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex align-items-center justify-content-between">
                        <div className="text-500">Attendance rate</div>
                        <div style={{ fontWeight: 700 }}>{Number.isFinite(rate) ? `${rate}%` : "0%"}</div>
                    </div>
                    <ProgressBar value={Number.isFinite(rate) ? rate : 0} showValue={false} />
                </div>
            </Card>

            <Card>
                <div className="flex align-items-center justify-content-between mb-3">
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Attendance Records</div>
                    <Button icon="pi pi-download" label="Export CSV" outlined onClick={exportCsv} disabled={loading || !details?.length} />
                </div>

                <DataTable
                    value={details}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage={loading ? "Loading..." : "No attendance records"}
                    loading={loading}
                >
                    <Column field="date" header="Date" />
                    <Column header="Time" body={timeTemplate} />
                    <Column header="Course" body={courseTitleTemplate} />
                    <Column header="Status" body={statusTemplate} />
                    <Column field="note" header="Note" />
                </DataTable>
            </Card>
        </div>
    );
}
