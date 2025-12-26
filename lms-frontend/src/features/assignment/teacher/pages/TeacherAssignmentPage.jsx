import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";
import {
    fetchTeacherAssignmentsByCourse,
    createTeacherAssignment,
    updateTeacherAssignment,
    deleteTeacherAssignment,
    publishTeacherAssignment,
} from "@/features/assignment/api/assignmentService.js";

import TeacherAssignmentForm from "@/features/assignment/teacher/components/TeacherAssignmentForm.jsx";

/* ==========================
 * FE validate / error mapping
 * ========================== */

const LIMITS = { QUIZ_PHASE: 4, MID_TEST: 1, FINAL_TEST: 1 };

const ERROR_MESSAGES = {
    ASSIGNMENT_LIMIT_EXCEEDED:
        "Course chỉ được tạo đúng: 4 Quiz phase, 1 Mid test, 1 Final test.",
    INVALID_FACTOR:
        "Factor không đúng theo loại bài (Quiz=1, Mid=3, Final=5).",
    INVALID_TOTAL_SCORE: "Max score bắt buộc là 10.",
    FINAL_REQUIRES_MID: "Phải tạo Mid test trước khi tạo Final test.",
    ASSIGNMENT_LOCKED:
        "Assignment đã có bài nộp nên không thể sửa/xóa các thông tin chấm điểm.",
};

function getApiErrorCode(e) {
    return (
        e?.response?.data?.code ||
        e?.response?.data?.errorCode ||
        e?.response?.data?.result?.code ||
        null
    );
}

function showApiError(toastRef, e, fallback = "Thao tác thất bại.") {
    const code = getApiErrorCode(e);
    toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: ERROR_MESSAGES[code] || fallback,
        life: 3500,
    });
}

function normalizeType(row) {
    const raw = row?.assignmentType;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw;
}

export default function TeacherAssignmentPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [assignments, setAssignments] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);

    const [formVisible, setFormVisible] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editing, setEditing] = useState(null);

    const toastRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadMyCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadAssignments(selectedCourseId);
        } else {
            setAssignments([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourseId]);

    const counts = useMemo(() => {
        const c = { QUIZ_PHASE: 0, MID_TEST: 0, FINAL_TEST: 0 };
        (assignments || []).forEach((a) => {
            const t = normalizeType(a);
            if (t && c[t] != null) c[t] += 1;
        });
        return c;
    }, [assignments]);

    const loadMyCourses = async () => {
        try {
            setLoadingCourses(true);
            const res = await axiosClient.get(AppUrls.getTeacherCourses);
            const apiRes = res.data || {};

            const payload = apiRes.result ?? apiRes.data ?? [];
            const list = Array.isArray(payload)
                ? payload
                : payload.content ?? payload.items ?? [];

            const options = (list || []).map((c) => ({
                label:
                    c.courseName ||
                    c.name ||
                    `${c.subjectName || ""} - ${c.courseId}`,
                value: c.courseId,
            }));

            setCourses(options);
            if (options.length > 0) {
                setSelectedCourseId(options[0].value);
            }
        } catch (e) {
            console.error("Failed to load teacher courses", e);
            showApiError(toastRef, e, "Không tải được danh sách khóa học.");
        } finally {
            setLoadingCourses(false);
        }
    };

    const loadAssignments = async (courseId) => {
        try {
            setLoadingAssignments(true);
            const list = await fetchTeacherAssignmentsByCourse(courseId);
            setAssignments(list || []);
        } catch (e) {
            console.error("Failed to load assignments", e);
            showApiError(toastRef, e, "Không tải được danh sách assignment.");
        } finally {
            setLoadingAssignments(false);
        }
    };

    const openCreateForm = () => {
        setEditing(null);
        setFormVisible(true);
    };

    const openEditForm = (row) => {
        setEditing(row);
        setFormVisible(true);
    };

    const handleDelete = (row) => {
        confirmDialog({
            header: "Delete assignment",
            message: `Bạn chắc chắn muốn xoá "${row.title}"?`,
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Delete",
            rejectLabel: "Cancel",
            accept: async () => {
                try {
                    await deleteTeacherAssignment(row.id);
                    toastRef.current?.show({
                        severity: "success",
                        summary: "Deleted",
                        detail: "Assignment deleted",
                    });
                    if (selectedCourseId) {
                        await loadAssignments(selectedCourseId);
                    }
                } catch (e) {
                    console.error(e);
                    showApiError(toastRef, e, "Không xoá được assignment.");
                }
            },
        });
    };

    const handleSubmitForm = async (payload) => {
        if (!selectedCourseId) return;

        // NOTE: BE hiện lấy getFirst(), FE phải ép chỉ 1 type để đúng UI/logic
        const rawType = payload?.assignmentType;
        const type = Array.isArray(rawType) ? rawType[0] : rawType;

        if (!type) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Missing type",
                detail: "Please select assignment type.",
                life: 2500,
            });
            return;
        }

        // ===== FE validate nghiệp vụ: limit 4/1/1 + FINAL requires MID (chặn sớm) =====
        // chỉ chặn khi create mới; edit để BE quyết định (vì có thể là edit title/dueDate)
        if (!editing) {
            if ((counts[type] ?? 0) >= (LIMITS[type] ?? 0)) {
                toastRef.current?.show({
                    severity: "warn",
                    summary: "Limit exceeded",
                    detail:
                        type === "QUIZ_PHASE"
                            ? "Đã đủ 4 Quiz phase."
                            : type === "MID_TEST"
                                ? "Đã có Mid test."
                                : "Đã có Final test.",
                    life: 3000,
                });
                return;
            }

            if (type === "FINAL_TEST" && (counts.MID_TEST ?? 0) < 1) {
                toastRef.current?.show({
                    severity: "warn",
                    summary: "Invalid flow",
                    detail: "Phải tạo Mid test trước khi tạo Final test.",
                    life: 3000,
                });
                return;
            }
        }

        try {
            setFormLoading(true);

            const toSend = {
                ...payload,
                // ép lại assignmentType theo format cũ (array) để không phá service payload
                assignmentType: Array.isArray(payload.assignmentType)
                    ? [type]
                    : [type],
                courseId: selectedCourseId,
            };

            if (editing) {
                await updateTeacherAssignment(editing.id, toSend);

                toastRef.current?.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "Assignment updated",
                });

                setFormVisible(false);
                setEditing(null);
                await loadAssignments(selectedCourseId);
            } else {
                const created = await createTeacherAssignment(
                    selectedCourseId,
                    toSend
                );

                toastRef.current?.show({
                    severity: "success",
                    summary: "Created",
                    detail: "Assignment created",
                });

                setFormVisible(false);
                setEditing(null);

                // created có thể là object hoặc {result: {...}}
                const createdId = created?.id ?? created?.result?.id;
                if (createdId) {
                    navigate(`/teacher/assignments/${createdId}/quiz-builder`);
                } else {
                    // fallback: reload list
                    await loadAssignments(selectedCourseId);
                }
            }
        } catch (e) {
            console.error(e);
            showApiError(toastRef, e, "Không lưu được assignment.");
        } finally {
            setFormLoading(false);
        }
    };

    const typeBodyTemplate = (row) => {
        const raw = row.assignmentType;

        // hỗ trợ cả string enum (BE) và array (FE cũ)
        const types = Array.isArray(raw) ? raw : raw ? [raw] : [];

        if (!types.length) return <span>-</span>;
        return (
            <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                    <Tag key={t} value={t} />
                ))}
            </div>
        );
    };

    const statusBodyTemplate = (row) => {
        const active = row.isActive ?? row.active ?? false;
        return (
            <Tag
                value={active ? "Active" : "Inactive"}
                severity={active ? "success" : "danger"}
            />
        );
    };

    const handlePublish = async (row) => {
        if (!selectedCourseId) return;
        try {
            setTableLoading(true);
            await publishTeacherAssignment(row.id);
            await loadAssignments(selectedCourseId);

            toastRef.current?.show({
                severity: "success",
                summary: "Sent",
                detail: `Đã gửi bài "${row.title}" cho học sinh.`,
            });
        } catch (e) {
            console.error(e);
            showApiError(toastRef, e, "Không gửi được bài tập.");
        } finally {
            setTableLoading(false);
        }
    };

    const actionsBodyTemplate = (row) => {
        const isActive = row.isActive ?? row.active ?? false;

        return (
            <div className="flex gap-2 justify-content-end">
                {!isActive && (
                    <Button
                        label="Send"
                        size="small"
                        severity="success"
                        onClick={() => handlePublish(row)}
                    />
                )}

                <Button
                    label="Students"
                    size="small"
                    outlined
                    onClick={() =>
                        navigate(`/teacher/assignments/${row.id}/students`)
                    }
                />

                <Button
                    label="Quiz Builder"
                    size="small"
                    outlined
                    onClick={() =>
                        navigate(`/teacher/assignments/${row.id}/quiz-builder`)
                    }
                />

                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    size="small"
                    onClick={() => openEditForm(row)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    size="small"
                    onClick={() => handleDelete(row)}
                />
            </div>
        );
    };

    return (
        <div className="page-wrap">
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-clipboard title-icon" />
                    <div>
                        <h2 className="title">Assignments</h2>
                        <p className="subtitle">
                            Tạo và quản lý assignment cho từng khóa học bạn dạy.
                        </p>
                    </div>
                </div>

                <div className="flex align-items-center gap-2">
                    <span className="text-sm text-muted-color">Course</span>
                    <Dropdown
                        value={selectedCourseId}
                        options={courses}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setSelectedCourseId(e.value)}
                        placeholder={
                            loadingCourses ? "Loading..." : "Chọn khóa học"
                        }
                        className="w-20rem"
                    />
                    <Button
                        label="New Assignment"
                        icon="pi pi-plus"
                        onClick={openCreateForm}
                        disabled={!selectedCourseId || loadingCourses}
                    />
                </div>
            </div>

            <Card>
                <div className="flex justify-content-between align-items-center mb-2">
                    <div className="text-sm text-muted-color">
                        Limit: Quiz {counts.QUIZ_PHASE}/4 · Mid {counts.MID_TEST}/1 · Final{" "}
                        {counts.FINAL_TEST}/1
                    </div>
                </div>

                <DataTable
                    value={assignments}
                    loading={loadingAssignments || tableLoading}
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage={
                        selectedCourseId
                            ? "Chưa có assignment nào cho khóa học này."
                            : "Hãy chọn một khóa học."
                    }
                >
                    <Column field="title" header="Title" sortable />
                    <Column
                        field="dueDate"
                        header="Due"
                        sortable
                        body={(row) =>
                            row.dueDate
                                ? new Date(row.dueDate).toLocaleString()
                                : "-"
                        }
                    />
                    <Column
                        field="maxScore"
                        header="Max Score"
                        body={(row) => row.maxScore ?? "-"}
                    />
                    <Column header="Type" body={typeBodyTemplate} />
                    <Column header="Active" body={statusBodyTemplate} />
                    <Column
                        header=""
                        body={actionsBodyTemplate}
                        style={{ width: "20rem" }}
                    />
                </DataTable>
            </Card>

            <Dialog
                header={editing ? "Edit assignment" : "New assignment"}
                visible={formVisible}
                style={{ width: "600px" }}
                onHide={() => {
                    if (formLoading) return;
                    setFormVisible(false);
                    setEditing(null);
                }}
                className="teacher-edit-dialog"
            >
                <TeacherAssignmentForm
                    defaultValues={editing}
                    submitting={formLoading}
                    onSubmit={handleSubmitForm}
                    onCancel={() => {
                        if (formLoading) return;
                        setFormVisible(false);
                        setEditing(null);
                    }}
                    counts={counts}
                />
            </Dialog>
        </div>
    );
}
