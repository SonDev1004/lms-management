import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

import { fetchStudentAssignments } from "@/features/assignment/api/assignmentService.js";

function normalizeStatus(status) {
    if (!status) return "not_submitted";
    const s = String(status).toUpperCase();
    if (s === "GRADED") return "graded";
    if (s === "SUBMITTED") return "submitted";
    return "not_submitted";
}

// giống bên Teacher
function normalizeTypes(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (!trimmed) return [];

        if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                console.error(e.toString());
            }
        }

        if (trimmed.includes(",")) {
            return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
        }

        return [trimmed];
    }

    return [];
}

export default function StudentAssignmentsPage({ course }) {
    const courseId =
        course?.id ?? course?.courseId ?? course?.course_id ?? null;

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            if (!courseId) return;
            try {
                setLoading(true);
                const list = await fetchStudentAssignments(courseId);
                setAssignments(list || []);
            } catch (e) {
                console.error("Failed to load assignments", e);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Không tải được danh sách bài tập.",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [courseId]);

    const statusBodyTemplate = (row) => {
        const s = normalizeStatus(row.studentStatus);
        if (s === "graded") {
            return <Tag value="Graded" severity="success" />;
        }
        if (s === "submitted") {
            return <Tag value="Submitted" severity="info" />;
        }
        return <Tag value="Not submitted" severity="warning" />;
    };

    const typeBodyTemplate = (row) => {
        const types = normalizeTypes(row.assignmentType);
        if (!types.length) return <span>-</span>;
        return (
            <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                    <Tag key={t} value={t} />
                ))}
            </div>
        );
    };

    const actionsBodyTemplate = (row) => {
        // const types = normalizeTypes(row.assignmentType);
        // const isQuiz = types.includes("QUIZ_PHASE");
        // if (!isQuiz) return null;

        const s = normalizeStatus(row.studentStatus);
        const label = s === "graded" ? "View result" : "Start";

        return (
            <div className="flex gap-2 justify-content-end">
                <Button
                    label={label}
                    size="small"
                    onClick={() => navigate(`/student/assignments/${row.id}/quiz`)}
                />
            </div>
        );
    };

    const dueBodyTemplate = (row) => {
        const value = row.due ?? row.dueDate;
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleString();
    };

    return (
        <div className="page-wrap">
            <Toast ref={toastRef} />

            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-clipboard title-icon" />
                    <div>
                        <h2 className="title">Assignments</h2>
                        <p className="subtitle">
                            Bài tập & quiz cho khóa học này.
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <DataTable
                    value={assignments}
                    loading={loading}
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
                    emptyMessage={
                        courseId
                            ? "Chưa có assignment nào cho khóa học này."
                            : "Không xác định được khóa học."
                    }
                >
                    <Column field="title" header="Title" sortable />
                    <Column
                        field="due"
                        header="Due"
                        sortable
                        body={dueBodyTemplate}
                    />
                    <Column
                        field="maxScore"
                        header="Max Score"
                        body={(row) => row.maxScore ?? "-"}
                    />
                    <Column header="Type" body={typeBodyTemplate} />
                    <Column header="Status" body={statusBodyTemplate} />
                    <Column
                        header=""
                        body={actionsBodyTemplate}
                        style={{ width: "12rem" }}
                    />
                </DataTable>
            </Card>
        </div>
    );
}
