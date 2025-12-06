import React, {useEffect, useState, useRef} from "react";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {useNavigate} from "react-router-dom";

import {
    fetchStudentAssignments,
    requestAssignmentRetake,
} from "@/features/assignment/api/assignmentService.js";

function normalizeStatus(status) {
    if (!status) return "not_submitted";
    const s = String(status).toUpperCase();

    if (s === "GRADED") return "graded";
    if (s === "SUBMITTED") return "submitted";
    if (s === "MISSING") return "missing";
    if (s === "RETAKE_PENDING") return "retake_pending";
    if (s === "RETAKE_APPROVED") return "retake_approved";

    if (status === "retake_pending" || status === "retake_approved") {
        return status;
    }

    return "not_submitted";
}


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

export default function StudentAssignmentsPage({course}) {
    const courseId =
        course?.id ?? course?.courseId ?? course?.course_id ?? null;

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);
    const navigate = useNavigate();
    const [retakeVisible, setRetakeVisible] = useState(false);
    const [retakeAssignment, setRetakeAssignment] = useState(null);
    const [retakeReason, setRetakeReason] = useState("");
    const [retakeSubmitting, setRetakeSubmitting] = useState(false);
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
    const openRetakeDialog = (row) => {
        setRetakeAssignment(row);
        setRetakeReason("");
        setRetakeVisible(true);
    };

    const handleSubmitRetake = async () => {
        if (!retakeAssignment?.id) return;
        try {
            setRetakeSubmitting(true);
            await requestAssignmentRetake(retakeAssignment.id, retakeReason || "");

            toastRef.current?.show({
                severity: "success",
                summary: "Requested",
                detail: "Đã gửi yêu cầu thi lại.",
            });

            setRetakeVisible(false);
            setRetakeAssignment(null);
            setRetakeReason("");
            if (courseId) {
                const list = await fetchStudentAssignments(courseId);
                setAssignments(list || []);
            }
        } catch (e) {
            console.error(e);
            toastRef.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Không gửi được yêu cầu thi lại.",
            });
        } finally {
            setRetakeSubmitting(false);
        }
    };

    const statusBodyTemplate = (row) => {
        const s = normalizeStatus(row.studentStatus);

        if (s === "graded") {
            return <Tag value="Graded" severity="success"/>;
        }
        if (s === "submitted") {
            return <Tag value="Submitted" severity="info"/>;
        }
        if (s === "missing") {
            return <Tag value="Missing" severity="danger"/>;
        }
        if (s === "retake_pending") {
            return <Tag value="Retake requested" severity="warning"/>;
        }
        if (s === "retake_approved") {
            return <Tag value="Retake approved" severity="success"/>;
        }
        return <Tag value="Not submitted" severity="warning"/>;
    };


    const typeBodyTemplate = (row) => {
        const types = normalizeTypes(row.assignmentType);
        if (!types.length) return <span>-</span>;
        return (
            <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                    <Tag key={t} value={t}/>
                ))}
            </div>
        );
    };

    const actionsBodyTemplate = (row) => {
        const s = normalizeStatus(row.studentStatus);
        const label = s === "graded" ? "View result" : "Start";

        // Đã nộp → cho xem summary
        if (s === "submitted" || s === "graded") {
            return (
                <div className="flex gap-2 justify-content-end">
                    <Button
                        label="View submission"
                        size="small"
                        onClick={() =>
                            navigate(`/student/assignments/${row.id}/submission-summary`)
                        }
                    />
                </div>
            );
        }

        // Quá hạn, chưa xin thi lại
        if (s === "missing") {
            return (
                <div className="flex gap-2 justify-content-end">
                    <Button
                        label="Request retake"
                        size="small"
                        outlined
                        onClick={() => openRetakeDialog(row)}
                    />
                </div>
            );
        }

        // Đã yêu cầu – đang chờ duyệt
        if (s === "retake_pending") {
            return (
                <div className="flex gap-2 justify-content-end">
                    <Button
                        label="Waiting approval"
                        size="small"
                        disabled
                    />
                </div>
            );
        }

        // Được duyệt – cho phép start lại
        if (s === "retake_approved") {
            return (
                <div className="flex gap-2 justify-content-end">
                    <Button
                        label="Start (retake)"
                        size="small"
                        onClick={() =>
                            navigate(`/student/assignments/${row.id}/quiz`)
                        }
                    />
                </div>
            );
        }

        // Chưa nộp, còn hạn → start lần đầu
        return (
            <div className="flex gap-2 justify-content-end">
                <Button
                    label={label}
                    size="small"
                    onClick={() =>
                        navigate(`/student/assignments/${row.id}/quiz`)
                    }
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
            <Toast ref={toastRef}/>

            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-clipboard title-icon"/>
                    <div>
                        <h2 className="title">Assignments</h2>
                        <p className="subtitle">
                            Bài tập & quiz cho khóa học này.
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <Dialog
                    header={
                        retakeAssignment
                            ? `Request retake – ${retakeAssignment.title}`
                            : "Request retake"
                    }
                    visible={retakeVisible}
                    style={{width: "480px"}}
                    onHide={() => {
                        if (retakeSubmitting) return;
                        setRetakeVisible(false);
                        setRetakeAssignment(null);
                        setRetakeReason("");
                    }}
                >
                    <div className="flex flex-column gap-3">
                        <p>
                            Vui lòng giải thích lý do bạn xin thi lại bài này (optional nhưng nên có).
                        </p>
                        <InputTextarea
                            rows={4}
                            autoResize
                            value={retakeReason}
                            onChange={(e) => setRetakeReason(e.target.value)}
                            placeholder="Ví dụ: Em bị ốm vào ngày kiểm tra, em xin được làm bù..."
                        />

                        <div className="flex justify-content-end gap-2 mt-3">
                            <Button
                                label="Cancel"
                                outlined
                                onClick={() => {
                                    if (retakeSubmitting) return;
                                    setRetakeVisible(false);
                                    setRetakeAssignment(null);
                                    setRetakeReason("");
                                }}
                            />
                            <Button
                                label={retakeSubmitting ? "Sending..." : "Send request"}
                                icon="pi pi-send"
                                onClick={handleSubmitRetake}
                                disabled={retakeSubmitting}
                            />
                        </div>
                    </div>
                </Dialog>
                <DataTable
                    value={assignments}
                    loading={loading}
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage={
                        courseId
                            ? "Chưa có assignment nào cho khóa học này."
                            : "Không xác định được khóa học."
                    }
                >

                <Column field="title" header="Title" sortable/>
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
                    <Column header="Type" body={typeBodyTemplate}/>
                    <Column header="Status" body={statusBodyTemplate}/>
                    <Column
                        header=""
                        body={actionsBodyTemplate}
                        style={{width: "12rem"}}
                    />
                </DataTable>
            </Card>
        </div>
    );
}
