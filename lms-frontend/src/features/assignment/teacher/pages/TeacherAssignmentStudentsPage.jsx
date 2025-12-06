import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Tag} from "primereact/tag";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";

import {
    fetchAssignmentStudentsForTeacher,
    remindNotSubmittedStudents,
    fetchRetakeRequestsForAssignment,
    handleRetakeRequest,
} from "@/features/assignment/api/assignmentService.js";


export default function TeacherAssignmentStudentsPage() {
    const {assignmentId} = useParams();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);
    const navigate = useNavigate();
    const [retakeVisible, setRetakeVisible] = useState(false);
    const [retakeLoading, setRetakeLoading] = useState(false);
    const [retakeRows, setRetakeRows] = useState([]);

    const loadData = async () => {
        if (!assignmentId) return;
        try {
            setLoading(true);
            const data = await fetchAssignmentStudentsForTeacher(assignmentId);
            setRows(data);
        } catch (e) {
            console.error(e);
            toastRef.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Không tải được danh sách học sinh.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [assignmentId]);
    const handleApprove = async (row) => {
        try {
            await handleRetakeRequest(row.id, {
                approve: true,
                adminNote: "",
                retakeDeadline: null, // để BE tự set default 2 ngày chẳng hạn
            });
            toastRef.current?.show({
                severity: "success",
                summary: "Approved",
                detail: `Đã duyệt thi lại cho ${row.studentName}`,
            });
            await reloadRetakeList();
        } catch (e) {
            console.error(e);
            toastRef.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Không duyệt được yêu cầu.",
            });
        }
    };

    const handleReject = async (row) => {
        try {
            await handleRetakeRequest(row.id, {
                approve: false,
                adminNote: "",
                retakeDeadline: null,
            });
            toastRef.current?.show({
                severity: "info",
                summary: "Rejected",
                detail: `Đã từ chối yêu cầu của ${row.studentName}`,
            });
            await reloadRetakeList();
        } catch (e) {
            console.error(e);
            toastRef.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Không từ chối được yêu cầu.",
            });
        }
    };

    const openRetakeDialog = async () => {
        if (!assignmentId) return;
        try {
            setRetakeVisible(true);
            setRetakeLoading(true);
            const list = await fetchRetakeRequestsForAssignment(assignmentId);
            setRetakeRows(list || []);
        } catch (e) {
            console.error(e);
            toastRef.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Không tải được yêu cầu thi lại.",
            });
        } finally {
            setRetakeLoading(false);
        }
    };

    const reloadRetakeList = async () => {
        if (!assignmentId || !retakeVisible) return;
        try {
            setRetakeLoading(true);
            const list = await fetchRetakeRequestsForAssignment(assignmentId);
            setRetakeRows(list || []);
        } catch (e) {
            console.error(e);
        } finally {
            setRetakeLoading(false);
        }
    };

    const statusBodyTemplate = (row) => {
        const s = (row.status || "").toUpperCase();
        let severity = "info";
        let label = "Unknown";

        if (s === "NOT_SUBMITTED") {
            severity = "danger";
            label = "Chưa nộp";
        } else if (s === "SUBMITTED") {
            severity = "warning";
            label = "Đã nộp";
        } else if (s === "GRADED") {
            severity = "success";
            label = "Đã chấm";
        }

        return <Tag value={label} severity={severity}/>;
    };

    const remindBodyTemplate = (row) => {
        const s = (row.status || "").toUpperCase();
        // chỉ nhắc những bạn chưa nộp
        const disabled = s !== "NOT_SUBMITTED";

        const handleClick = async () => {
            if (disabled) return;
            try {
                await remindNotSubmittedStudents(assignmentId, row.studentId);
                toastRef.current?.show({
                    severity: "success",
                    summary: "Đã gửi nhắc nhở",
                    detail: `Đã gửi nhắc nhở cho ${row.fullName}`,
                });
            } catch (e) {
                console.error(e);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Không gửi được nhắc nhở.",
                });
            }
        };

        return (
            <Button
                label="Nhắc nhở"
                size="small"
                disabled={disabled}
                onClick={handleClick}
            />
        );
    };

    const submittedAtBodyTemplate = (row) => {
        if (!row.submittedAt) return "-";
        return new Date(row.submittedAt).toLocaleString();
    };

    return (
        <div className="page-wrap">
            <Toast ref={toastRef}/>
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-users title-icon"/>
                    <div>
                        <h2 className="title">
                            Assignment #{assignmentId} – Students
                        </h2>
                        <p className="subtitle">
                            Danh sách học sinh trong khóa học này và trạng thái
                            làm bài.
                        </p>
                    </div>
                </div>

                <div className="flex align-items-center gap-2">
                    <Button
                        label="Back"
                        icon="pi pi-arrow-left"
                        outlined
                        onClick={() => navigate(-1)}
                    />

                    {/* Nút xem yêu cầu thi lại */}
                    <Button
                        label="Retake requests"
                        icon="pi pi-refresh"
                        outlined
                        onClick={openRetakeDialog}
                    />
                </div>
            </div>

            <Card>
                <DataTable
                    value={rows}
                    loading={loading}
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage="Không có học sinh nào."
                >
                <Column field="studentCode" header="Mã HS"/>
                    <Column field="fullName" header="Họ tên"/>
                    <Column field="className" header="Lớp"/>
                    <Column field="score" header="Điểm"/>
                    <Column
                        field="submittedAt"
                        header="Nộp lúc"
                        body={submittedAtBodyTemplate}
                    />
                    <Column
                        header="Trạng thái"
                        body={statusBodyTemplate}
                        style={{width: "140px"}}
                    />
                    <Column
                        header=""
                        body={remindBodyTemplate}
                        style={{width: "120px"}}
                    />
                </DataTable>
            </Card>
            <Dialog
                header={`Retake requests – Assignment #${assignmentId}`}
                visible={retakeVisible}
                style={{ width: "700px" }}
                onHide={() => setRetakeVisible(false)}
            >
                <DataTable
                    value={retakeRows}
                    loading={retakeLoading}
                    size="small"
                    stripedRows
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage="Không có yêu cầu thi lại nào."
                >
                <Column field="studentCode" header="Mã HS" style={{ width: "100px" }} />
                    <Column field="studentName" header="Họ tên" />
                    <Column
                        field="reason"
                        header="Lý do"
                        body={(row) => row.reason || "-"}
                    />
                    <Column
                        field="status"
                        header="Trạng thái"
                        body={(row) => {
                            const s = (row.status || "").toUpperCase();
                            if (s === "PENDING") return <Tag value="Pending" severity="warning" />;
                            if (s === "APPROVED") return <Tag value="Approved" severity="success" />;
                            if (s === "REJECTED") return <Tag value="Rejected" severity="danger" />;
                            return <Tag value={row.status || "-"} />;
                        }}
                        style={{ width: "110px" }}
                    />
                    <Column
                        header=""
                        style={{ width: "180px" }}
                        body={(row) => {
                            const s = (row.status || "").toUpperCase();
                            const disabled = s !== "PENDING";
                            return (
                                <div className="flex gap-2 justify-content-end">
                                    <Button
                                        label="Approve"
                                        size="small"
                                        icon="pi pi-check"
                                        disabled={disabled}
                                        onClick={() => handleApprove(row)}
                                    />
                                    <Button
                                        label="Reject"
                                        size="small"
                                        icon="pi pi-times"
                                        severity="danger"
                                        disabled={disabled}
                                        onClick={() => handleReject(row)}
                                    />
                                </div>
                            );
                        }}
                    />
                </DataTable>
            </Dialog>
        </div>
    );
}
