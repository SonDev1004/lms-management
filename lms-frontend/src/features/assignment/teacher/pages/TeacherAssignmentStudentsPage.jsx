import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Tag} from "primereact/tag";
import {Toast} from "primereact/toast";

import {
    fetchAssignmentStudentsForTeacher,
    remindNotSubmittedStudents,
} from "@/features/assignment/api/assignmentService.js";

export default function TeacherAssignmentStudentsPage() {
    const {assignmentId} = useParams();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);
    const navigate = useNavigate();

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
                </div>
            </div>

            <Card>
                <DataTable
                    value={rows}
                    loading={loading}
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
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
        </div>
    );
}
