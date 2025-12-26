import React, {useEffect, useMemo, useRef, useState} from "react";
import {Card} from "primereact/card";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Tag} from "primereact/tag";
import {InputTextarea} from "primereact/inputtextarea";

import {
    approveMakeupRequest,
    fetchAdminMakeupRequests,
    getAvailableMakeupSessionsForAdminRequest,
    markMakeupRequestAttended,
    rejectMakeupRequest,
} from "@/features/attendance/api/makeupRequestService";

function fmtDT(dt) {
    if (!dt) return "";
    try {
        return new Date(dt).toLocaleString();
    } catch {
        return String(dt);
    }
}

const STATUS_OPTIONS = [
    {label: "All", value: ""},
    {label: "PENDING", value: "PENDING"},
    {label: "APPROVED", value: "APPROVED"},
    {label: "REJECTED", value: "REJECTED"},
    {label: "DONE", value: "DONE"},
];

export default function AMMakeupRequestsPage() {
    const toastRef = useRef(null);

    const [status, setStatus] = useState("PENDING");
    const [courseId, setCourseId] = useState("");

    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // dialogs
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [attendOpen, setAttendOpen] = useState(false);

    const [selected, setSelected] = useState(null);

    // approve form
    const [availableLoading, setAvailableLoading] = useState(false);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [selectedMakeupSessionId, setSelectedMakeupSessionId] = useState(null);
    const [adminNote, setAdminNote] = useState("");

    const load = async (nextPage = page) => {
        setLoading(true);
        try {
            const data = await fetchAdminMakeupRequests({
                status: status || undefined,
                courseId: courseId ? Number(courseId) : undefined,
                page: nextPage,
                size,
            });

            setRows(data?.content || []);
            setTotal(data?.totalElements || 0);
            setPage(data?.number ?? nextPage);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Load requests failed",
                detail: e?.response?.data?.message || e?.message || "Không tải được danh sách",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, courseId]);

    const statusTag = (row) => <Tag value={row?.status || ""}/>;

    const openApprove = async (row) => {
        setSelected(row);
        setAdminNote("");
        setAvailableSessions([]);
        setSelectedMakeupSessionId(row?.preferredSessionId ?? null);
        setApproveOpen(true);

        setAvailableLoading(true);
        try {
            const list = await getAvailableMakeupSessionsForAdminRequest(row.id);
            setAvailableSessions(list || []);
            // nếu preferred nằm trong list thì giữ; nếu không có preferred thì chọn item đầu tiên
            if (!row?.preferredSessionId && list?.length) {
                setSelectedMakeupSessionId(list[0].sessionId);
            }
        } catch (e) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Không load được available sessions",
                detail: "Bạn vẫn có thể approve bằng cách nhập sessionId ở BE, nhưng FE dropdown sẽ thiếu.",
            });
        } finally {
            setAvailableLoading(false);
        }
    };

    const openReject = (row) => {
        setSelected(row);
        setAdminNote("");
        setRejectOpen(true);
    };

    const openAttend = (row) => {
        setSelected(row);
        setAdminNote(""); // reuse as note
        setAttendOpen(true);
    };

    const makeupSessionOptions = useMemo(() => {
        return (availableSessions || []).map((s) => ({
            label: `${s.courseName} - ${fmtDT(s.sessionDateTime)} (Session #${s.sessionId})`,
            value: s.sessionId,
        }));
    }, [availableSessions]);

    const doApprove = async () => {
        if (!selected?.id) return;
        if (!selectedMakeupSessionId) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Thiếu makeupSessionId",
                detail: "Hãy chọn buổi học bù trong dropdown.",
            });
            return;
        }
        try {
            await approveMakeupRequest(selected.id, {
                makeupSessionId: Number(selectedMakeupSessionId),
                adminNote,
            });
            toastRef.current?.show({severity: "success", summary: "Approved", detail: "Đã duyệt yêu cầu học bù"});
            setApproveOpen(false);
            await load(page);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Approve failed",
                detail: e?.response?.data?.message || e?.message || "Không thể duyệt",
            });
        }
    };

    const doReject = async () => {
        if (!selected?.id) return;
        try {
            await rejectMakeupRequest(selected.id, {adminNote});
            toastRef.current?.show({severity: "success", summary: "Rejected", detail: "Đã từ chối yêu cầu học bù"});
            setRejectOpen(false);
            await load(page);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Reject failed",
                detail: e?.response?.data?.message || e?.message || "Không thể từ chối",
            });
        }
    };

    const doMarkAttended = async () => {
        if (!selected?.id) return;
        try {
            await markMakeupRequestAttended(selected.id, adminNote);
            toastRef.current?.show({
                severity: "success",
                summary: "DONE",
                detail: "Đã xác nhận học bù và cập nhật điểm danh"
            });
            setAttendOpen(false);
            await load(page);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Mark attended failed",
                detail: e?.response?.data?.message || e?.message || "Không thể xác nhận",
            });
        }
    };

    const actionsBody = (row) => (
        <div className="flex gap-2">
            {row.status === "PENDING" && (
                <>
                    <Button label="Approve" icon="pi pi-check" size="small" onClick={() => openApprove(row)}/>
                    <Button label="Reject" icon="pi pi-times" size="small" severity="danger"
                            onClick={() => openReject(row)}/>
                </>
            )}
            {row.status === "APPROVED" && (
                <Button label="Mark Attended" icon="pi pi-verified" size="small" severity="success"
                        onClick={() => openAttend(row)}/>
            )}
        </div>
    );

    return (
        <div className="p-3">
            <Toast ref={toastRef}/>

            <Card title="AM/Admin – Make-up Requests">
                <div className="grid p-fluid align-items-end">
                    <div className="col-12 md:col-3">
                        <label className="mb-2 block">Status</label>
                        <Dropdown value={status} options={STATUS_OPTIONS} onChange={(e) => setStatus(e.value)}/>
                    </div>
                    <div className="col-12 md:col-3">
                        <label className="mb-2 block">CourseId (optional)</label>
                        <InputText value={courseId} onChange={(e) => setCourseId(e.target.value)}
                                   placeholder="VD: 101"/>
                    </div>
                    <div className="col-12 md:col-2">
                        <Button label="Refresh" icon="pi pi-refresh" onClick={() => load(0)}/>
                    </div>
                </div>

                <DataTable
                    value={rows}
                    loading={loading}
                    paginator
                    rows={size}
                    totalRecords={total}
                    first={page * size}
                    onPage={(e) => {
                        const nextPage = Math.floor(e.first / e.rows);
                        load(nextPage);
                    }}
                    className="mt-3"
                    emptyMessage="Không có yêu cầu"
                    rowHover
                >
                    <Column field="id" header="ID" style={{width: 80}}/>
                    <Column header="Student" body={(r) => `${r.studentName} (#${r.studentId})`}/>
                    <Column header="Course gốc" body={(r) => `${r.courseName} (#${r.courseId})`}/>
                    <Column header="Buổi vắng" body={(r) => `${r.sessionTitle} - ${fmtDT(r.sessionDateTime)}`}/>
                    <Column header="Preferred" body={(r) => (r.preferredSessionId ? `#${r.preferredSessionId}` : "-")}/>
                    <Column header="Approved"
                            body={(r) => (r.approvedSessionId ? `#${r.approvedSessionId} - ${fmtDT(r.approvedSessionDateTime)}` : "-")}/>
                    <Column header="Status" body={statusTag} style={{width: 130}}/>
                    <Column header="Actions" body={actionsBody} style={{width: 320}}/>
                </DataTable>
            </Card>

            {/* Approve Dialog */}
            <Dialog
                header={`Approve Request #${selected?.id ?? ""}`}
                visible={approveOpen}
                onHide={() => setApproveOpen(false)}
                style={{width: "750px", maxWidth: "95vw"}}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancel" severity="secondary" onClick={() => setApproveOpen(false)}/>
                        <Button label="Approve" icon="pi pi-check" onClick={doApprove} loading={availableLoading}/>
                    </div>
                }
            >
                <div className="p-fluid">
                    <label className="mb-2 block">Chọn buổi học bù</label>
                    <Dropdown
                        value={selectedMakeupSessionId}
                        options={makeupSessionOptions}
                        onChange={(e) => setSelectedMakeupSessionId(e.value)}
                        placeholder={availableLoading ? "Loading..." : "Chọn session"}
                        disabled={availableLoading}
                        filter
                        showClear
                    />
                    {selected?.preferredSessionId && (
                        <small className="block mt-2">
                            PreferredSessionId: #{selected.preferredSessionId} (auto prefill nếu có)
                        </small>
                    )}

                    <label className="mb-2 mt-3 block">Admin note (optional)</label>
                    <InputTextarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4}
                                   autoResize/>
                </div>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                header={`Reject Request #${selected?.id ?? ""}`}
                visible={rejectOpen}
                onHide={() => setRejectOpen(false)}
                style={{width: "650px", maxWidth: "95vw"}}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancel" severity="secondary" onClick={() => setRejectOpen(false)}/>
                        <Button label="Reject" icon="pi pi-times" severity="danger" onClick={doReject}/>
                    </div>
                }
            >
                <div className="p-fluid">
                    <label className="mb-2 block">Admin note</label>
                    <InputTextarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4}
                                   autoResize/>
                </div>
            </Dialog>

            {/* Mark Attended Dialog */}
            <Dialog
                header={`Mark Attended #${selected?.id ?? ""}`}
                visible={attendOpen}
                onHide={() => setAttendOpen(false)}
                style={{width: "650px", maxWidth: "95vw"}}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancel" severity="secondary" onClick={() => setAttendOpen(false)}/>
                        <Button label="Confirm" icon="pi pi-verified" severity="success" onClick={doMarkAttended}/>
                    </div>
                }
            >
                <div className="p-fluid">
                    <label className="mb-2 block">Note (optional)</label>
                    <InputTextarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4}
                                   autoResize/>
                    <small className="block mt-2">Nếu bỏ trống, BE tự note “Đã học bù (course - buổi …)”.</small>
                </div>
            </Dialog>
        </div>
    );
}
