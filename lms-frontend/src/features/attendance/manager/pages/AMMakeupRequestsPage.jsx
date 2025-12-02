import {useEffect, useState, useRef} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Tag} from "primereact/tag";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";

import {
    fetchAdminMakeupRequests, markMakeupRequestAttended,
} from "@/features/attendance/api/makeupRequestService.js";

export default function AMMakeupRequestsPage() {
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [requests, setRequests] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({first: 0, rows: 20});
    const [loading, setLoading] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [note, setNote] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const toast = useRef(null);

    const loadData = async (page = 0, size = 20) => {
        setLoading(true);
        try {
            const res = await fetchAdminMakeupRequests({
                status: statusFilter, page, size,
            });

            const data = res.data?.result || res.data;
            // Page<MakeUpRequestResponse> từ BE: content, totalElements
            const items = data.content ?? data.items ?? [];
            const total = data.totalElements ?? data.total ?? items.length;

            setRequests(items);
            setTotalRecords(total);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.current?.show({
                severity: "error", summary: "Lỗi", detail: "Không tải được danh sách yêu cầu học bù.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = lazyParams.first / lazyParams.rows;
        loadData(page, lazyParams.rows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, lazyParams]);

    const onPage = (event) => {
        setLazyParams(event);
    };

    const openDialog = (row) => {
        setSelectedRequest(row);
        setNote(row.adminNote || "");
        setDialogVisible(true);
    };

    const handleMarkAttended = async () => {
        if (!selectedRequest) return;
        setSubmitLoading(true);
        try {
            await markMakeupRequestAttended(selectedRequest.id, note);
            toast.current?.show({
                severity: "success", summary: "Thành công", detail: "Đã xác nhận học bù và cập nhật điểm danh.",
            });
            setDialogVisible(false);

            const page = lazyParams.first / lazyParams.rows;
            loadData(page, lazyParams.rows);
        } catch (err) {
            const detail = err?.response?.data?.message || "Không thể xác nhận học bù. Vui lòng thử lại.";
            toast.current?.show({
                severity: "error", summary: "Lỗi", detail,
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const statusBody = (row) => {
        const map = {
            PENDING: {severity: "warning", label: "Chờ xử lý"},
            DONE: {severity: "success", label: "Đã học bù"},
            REJECTED: {severity: "danger", label: "Từ chối"},
        };
        const v = map[row.status] || {severity: "info", label: row.status};
        return <Tag value={v.label} severity={v.severity}/>;
    };

    const actionBody = (row) => {
        if (row.status !== "PENDING") return null;
        return (<Button
                label="Đã học bù"
                size="small"
                onClick={() => openDialog(row)}
            />);
    };

    const statusOptions = [{label: "Chờ xử lý", value: "PENDING"}, {
        label: "Đã học bù",
        value: "DONE"
    }, {label: "Từ chối", value: "REJECTED"}, {label: "Tất cả", value: ""},];

    const header = (<div className="p-d-flex p-jc-between p-ai-center p-mb-3">
            <h2 style={{margin: 0}}>Yêu cầu học bù</h2>
            <Dropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.value)}
                placeholder="Trạng thái"
                style={{width: 180}}
            />
        </div>);

    return (<div className="p-card p-p-3">
            <Toast ref={toast}/>
            {header}

            <DataTable
                value={requests}
                loading={loading}
                lazy
                paginator
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                rowsPerPageOptions={[10, 20, 50]}
                responsiveLayout="scroll"
            >
                <Column field="id" header="ID" style={{width: 70}}/>
                <Column field="studentName" header="Học sinh"/>
                <Column field="courseName" header="Khóa học"/>
                <Column field="sessionTitle" header="Buổi học"/>
                <Column
                    field="sessionDateTime"
                    header="Ngày học"
                    body={(row) => row.sessionDateTime ? new Date(row.sessionDateTime).toLocaleString("vi-VN") : ""}
                    style={{width: 200}}
                />
                <Column field="reason" header="Lý do" style={{minWidth: 220}}/>
                <Column header="Trạng thái" body={statusBody} style={{width: 140}}/>
                <Column header="Thao tác" body={actionBody} style={{width: 140}}/>
            </DataTable>

            <Dialog
                header="Xác nhận học bù"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{width: 480}}
                modal
            >
                <p>
                    Xác nhận học sinh{" "}
                    <strong>{selectedRequest?.studentName}</strong> đã học bù cho buổi{" "}
                    <strong>{selectedRequest?.sessionTitle}</strong>.
                </p>
                <p>Ghi chú (ngày học bù, lớp học bù,...):</p>
                <InputTextarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    style={{width: "100%"}}
                />

                <div style={{marginTop: 16, textAlign: "right"}}>
                    <Button
                        label="Hủy"
                        text
                        className="p-mr-2"
                        onClick={() => setDialogVisible(false)}
                        disabled={submitLoading}
                    />
                    <Button
                        label="Xác nhận đã học bù"
                        onClick={handleMarkAttended}
                        loading={submitLoading}
                    />
                </div>
            </Dialog>
        </div>);
}
