import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
    getSessionsForCourse,
    createStudentMakeupRequest,
} from "@/features/attendance/api/makeupRequestService";

export default function StudentMakeupRequestForm({ course }) {
    const toastRef = useRef(null);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const courseId = course?.id || course?.courseId;

    useEffect(() => {
        if (!courseId) return;

        const loadSessions = async () => {
            setLoading(true);
            try {
                const data = await getSessionsForCourse(courseId);
                console.log("Makeup sessions raw:", data);

                // chỉ lấy các buổi đã vắng: attendance === 0 (Absent)
                const options = (data || [])
                    .filter((s) => s.attendance === 0)
                    .map((s) => {
                        const date = s.date;
                        const start = s.startTime?.slice(0, 5) ?? "";
                        const end = s.endTime?.slice(0, 5) ?? "";
                        const status = s.statusText || "Absent";
                        return {
                            label: `${date} • ${start} - ${end} • ${status}`,
                            value: s.sessionId,
                        };
                    });
                setSessions(options);
            } catch (err) {
                console.error(err);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Không tải được danh sách buổi học.",
                });
            } finally {
                setLoading(false);
            }
        };

        void loadSessions();
    }, [courseId]);

    const handleSubmit = async () => {
        if (!selectedSessionId) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Thiếu thông tin",
                detail: "Vui lòng chọn buổi cần xin học bù.",
            });
            return;
        }
        if (!reason || reason.trim().length < 5) {
            toastRef.current?.show({
                severity: "warn",
                summary: "Thiếu lý do",
                detail: "Vui lòng nhập lý do (ít nhất 5 ký tự).",
            });
            return;
        }

        setSubmitting(true);
        try {
            await createStudentMakeupRequest(selectedSessionId, reason.trim());
            toastRef.current?.show({
                severity: "success",
                summary: "Đã gửi",
                detail: "Yêu cầu học bù đã được gửi tới phòng đào tạo.",
            });
            setSelectedSessionId(null);
            setReason("");
        } catch (err) {
            console.error(err);
            toastRef.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không gửi được yêu cầu học bù.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const disabled = loading || sessions.length === 0;

    return (
        <Card className="p-mt-3">
            <Toast ref={toastRef} />
            <h3 style={{ marginTop: 0 }}>Make-up Class Request</h3>

            {sessions.length === 0 && !loading && (
                <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
                    Bạn không có buổi nào vắng trong khóa học này,
                    hoặc dữ liệu điểm danh chưa được cập nhật.
                </p>
            )}

            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12">
                    <label htmlFor="mu-session">Select session</label>
                    <Dropdown
                        id="mu-session"
                        value={selectedSessionId}
                        options={sessions}
                        placeholder={loading ? "Loading..." : "Chọn buổi đã vắng cần học bù"}
                        onChange={(e) => setSelectedSessionId(e.value)}
                        filter
                        showClear
                        disabled={disabled}
                    />
                </div>

                <div className="p-field p-col-12">
                    <label htmlFor="mu-reason">Reason</label>
                    <InputTextarea
                        id="mu-reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Mô tả lý do vắng và mong muốn học bù..."
                        disabled={disabled}
                    />
                </div>

                <div className="p-field p-col-12" style={{ textAlign: "right" }}>
                    <Button
                        label="Submit make-up request"
                        onClick={handleSubmit}
                        loading={submitting}
                        disabled={disabled || submitting}
                    />
                </div>
            </div>
        </Card>
    );
}
