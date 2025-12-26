import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

import {
    createStudentMakeupRequest,
    getAvailableMakeupSessionsForStudent,
    getMyMakeupRequests,
    selectPreferredMakeupSession,
} from "@/features/attendance/api/makeupRequestService";

import { getStudentAttendanceDetails } from "@/features/attendance/api/attendanceService";

function fmtDT(dt) {
    if (!dt) return "";
    try { return new Date(dt).toLocaleString(); } catch { return String(dt); }
}

export default function StudentMakeupRequestForm({ course }) {
    const toastRef = useRef(null);

    const derivedCourseId =
        course?.courseId ?? course?.id ?? course?.course_id ?? null;

    // attendance details of this course
    const [attDetails, setAttDetails] = useState([]);
    const [loadingAtt, setLoadingAtt] = useState(false);

    // form state
    const [missedSessionId, setMissedSessionId] = useState(null);
    const [reason, setReason] = useState("");
    const [creating, setCreating] = useState(false);

    // after create
    const [createdRequest, setCreatedRequest] = useState(null);

    // available sessions dialog
    const [availableOpen, setAvailableOpen] = useState(false);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [availableSessions, setAvailableSessions] = useState([]);

    // my requests table
    const [myRows, setMyRows] = useState([]);
    const [myTotal, setMyTotal] = useState(0);
    const [myLoading, setMyLoading] = useState(false);
    const [myPage, setMyPage] = useState(0);
    const [mySize] = useState(10);
    const [filterStatus, setFilterStatus] = useState("");

    const statusOptions = useMemo(
        () => [
            { label: "All", value: "" },
            { label: "PENDING", value: "PENDING" },
            { label: "APPROVED", value: "APPROVED" },
            { label: "REJECTED", value: "REJECTED" },
            { label: "DONE", value: "DONE" },
        ],
        []
    );

    // 1) Load attendance details for THIS course, then filter absent rows
    useEffect(() => {
        if (!derivedCourseId) return;

        (async () => {
            setLoadingAtt(true);
            try {
                const det = await getStudentAttendanceDetails(derivedCourseId);

                // det có thể là array hoặc {content:[]}
                const list = Array.isArray(det) ? det : (det?.content ?? det?.items ?? []);
                setAttDetails(list);

                // reset selection when course changes
                setMissedSessionId(null);
            } catch (e) {
                console.error(e);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Load attendance failed",
                    detail: e?.response?.data?.message || e?.message || "Không tải được attendance",
                });
                setAttDetails([]);
            } finally {
                setLoadingAtt(false);
            }
        })();
    }, [derivedCourseId]);

    // 2) Absent sessions = attendance === 0
    const absentRows = useMemo(() => {
        return (attDetails || []).filter((r) => r?.attendance === 0);
    }, [attDetails]);

    // 3) Dropdown options from absentRows
    const missedOptions = useMemo(() => {
        return absentRows
            .map((r) => {
                const sessionId = r.sessionId ?? r.id; // <-- MUST exist
                if (!sessionId) return null;

                const date = r.date ?? "";
                const start = r.startTime?.slice?.(0, 5) ?? "";
                const end = r.endTime?.slice?.(0, 5) ?? "";

                // nếu BE có orderSession thì hiển thị đẹp hơn
                const title = r.orderSession ? `Buổi ${r.orderSession}` : `Session #${sessionId}`;

                const time = start && end ? `${start}-${end}` : start || end;
                const label = `${title}${date ? " - " + date : ""}${time ? " " + time : ""}`;

                return { label, value: sessionId };
            })
            .filter(Boolean);
    }, [absentRows]);

    // load my requests (giữ như bạn đang có)
    const loadMyRequests = async (page = myPage) => {
        setMyLoading(true);
        try {
            const data = await getMyMakeupRequests({
                status: filterStatus || undefined,
                courseId: derivedCourseId || undefined, // optional: lọc luôn theo course hiện tại
                page,
                size: mySize,
            });
            setMyRows(data?.content || []);
            setMyTotal(data?.totalElements || 0);
            setMyPage(data?.number ?? page);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Load my requests failed",
                detail: e?.response?.data?.message || e?.message || "Không tải được danh sách",
            });
        } finally {
            setMyLoading(false);
        }
    };

    useEffect(() => {
        void loadMyRequests(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, derivedCourseId]);

    const canCreate = !!missedSessionId && reason.trim().length > 0 && !creating;

    const openAvailable = async (missedId) => {
        setAvailableOpen(true);
        setAvailableLoading(true);
        try {
            const list = await getAvailableMakeupSessionsForStudent(missedId);
            setAvailableSessions(list || []);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Load available sessions failed",
                detail: e?.response?.data?.message || e?.message || "Không tải được lịch bù",
            });
            setAvailableSessions([]);
        } finally {
            setAvailableLoading(false);
        }
    };

    const onCreate = async () => {
        if (!canCreate) return;
        setCreating(true);
        try {
            const req = await createStudentMakeupRequest(missedSessionId, reason.trim());
            setCreatedRequest(req);

            toastRef.current?.show({
                severity: "success",
                summary: "Đã tạo yêu cầu",
                detail: "Tạo thành công. Hãy chọn lịch học bù mong muốn (preferred).",
            });

            await openAvailable(missedSessionId);
            await loadMyRequests(0);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Tạo yêu cầu thất bại",
                detail: e?.response?.data?.message || e?.message || "Không thể tạo yêu cầu",
            });
        } finally {
            setCreating(false);
        }
    };

    const onSelectPreferred = async (preferredSessionId) => {
        const requestId = createdRequest?.id;
        if (!requestId) return;

        try {
            const updated = await selectPreferredMakeupSession(requestId, preferredSessionId);
            setCreatedRequest(updated);
            toastRef.current?.show({
                severity: "success",
                summary: "Đã chọn preferred",
                detail: "Yêu cầu đang chờ AM duyệt.",
            });
            setAvailableOpen(false);
            await loadMyRequests(0);
        } catch (e) {
            toastRef.current?.show({
                severity: "error",
                summary: "Chọn preferred thất bại",
                detail: e?.response?.data?.message || e?.message || "Không thể chọn lịch",
            });
        }
    };

    const statusTag = (r) => <Tag value={r?.status || ""} />;

    const courseTitle = course?.courseName ?? course?.title ?? course?.name ?? "Course";

    return (
        <div className="p-3">
            <Toast ref={toastRef} />

            <Card title="Student – Tạo yêu cầu học bù">
                <div className="p-fluid grid">
                    {/* Course: lấy từ CourseDetail */}
                    <div className="col-12">
                        <div className="mb-2"><b>Course:</b> {courseTitle} {derivedCourseId ? `( #${derivedCourseId} )` : ""}</div>
                    </div>

                    {/* Buổi vắng: chỉ lấy absentRows */}
                    <div className="col-12 md:col-6">
                        <label className="mb-2 block">Buổi vắng (missed session)</label>
                        <Dropdown
                            value={missedSessionId}
                            options={missedOptions}
                            onChange={(e) => setMissedSessionId(e.value)}
                            placeholder={loadingAtt ? "Đang tải..." : "Chọn buổi vắng"}
                            filter
                            showClear
                            disabled={!derivedCourseId || loadingAtt}
                        />
                        {!loadingAtt && derivedCourseId && missedOptions.length === 0 && (
                            <small className="text-500">Không có buổi vắng để xin học bù.</small>
                        )}
                    </div>

                    <div className="col-12">
                        <label className="mb-2 block">Reason</label>
                        <InputTextarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            autoResize
                            placeholder="Nhập lý do xin học bù..."
                        />
                    </div>

                    <div className="col-12 flex gap-2">
                        <Button label="Create Request" icon="pi pi-send" onClick={onCreate} disabled={!canCreate} loading={creating} />
                        <Button
                            label="Available Sessions"
                            icon="pi pi-calendar"
                            severity="secondary"
                            onClick={() => openAvailable(missedSessionId)}
                            disabled={!missedSessionId}
                        />
                    </div>
                </div>

                {createdRequest?.id && (
                    <div className="mt-3">
                        <div className="flex align-items-center gap-2">
                            <b>Request vừa tạo:</b> {statusTag(createdRequest)} <span>#{createdRequest.id}</span>
                        </div>
                    </div>
                )}
            </Card>

            <Card title="My Make-up Requests" className="mt-3">
                <div className="grid p-fluid align-items-end">
                    <div className="col-12 md:col-3">
                        <label className="mb-2 block">Filter Status</label>
                        <Dropdown value={filterStatus} options={statusOptions} onChange={(e) => setFilterStatus(e.value)} />
                    </div>
                    <div className="col-12 md:col-3">
                        <Button label="Refresh" icon="pi pi-refresh" onClick={() => loadMyRequests(0)} />
                    </div>
                </div>

                <DataTable
                    value={myRows}
                    loading={myLoading}
                    paginator
                    rows={mySize}
                    totalRecords={myTotal}
                    first={myPage * mySize}
                    onPage={(e) => loadMyRequests(Math.floor(e.first / e.rows))}
                    emptyMessage="Chưa có yêu cầu"
                    className="mt-3"
                    rowHover
                >
                    <Column field="id" header="ID" style={{ width: 80 }} />
                    <Column header="Course" body={(r) => `${r.courseName} (#${r.courseId})`} />
                    <Column header="Missed" body={(r) => `${r.sessionTitle} - ${fmtDT(r.sessionDateTime)}`} />
                    <Column header="Preferred" body={(r) => (r.preferredSessionId ? `#${r.preferredSessionId}` : "-")} />
                    <Column header="Approved" body={(r) => (r.approvedSessionId ? `#${r.approvedSessionId} - ${fmtDT(r.approvedSessionDateTime)}` : "-")} />
                    <Column header="Status" body={statusTag} style={{ width: 130 }} />
                    <Column header="Admin Note" field="adminNote" />
                </DataTable>
            </Card>

            <Dialog
                header="Available Make-up Sessions"
                visible={availableOpen}
                onHide={() => setAvailableOpen(false)}
                style={{ width: "900px", maxWidth: "95vw" }}
            >
                <DataTable value={availableSessions} loading={availableLoading} paginator rows={8} emptyMessage="Không có buổi phù hợp">
                    <Column field="courseName" header="Course" />
                    <Column field="teacherName" header="Teacher" />
                    <Column field="roomName" header="Room" />
                    <Column header="DateTime" body={(r) => fmtDT(r.sessionDateTime)} />
                    <Column
                        header=""
                        body={(r) => (
                            <Button label="Select" icon="pi pi-check" size="small" onClick={() => onSelectPreferred(r.sessionId)} />
                        )}
                    />
                </DataTable>
            </Dialog>
        </div>
    );
}
