import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";

import { fetchStudentSubmissionSummary } from "@/features/assignment/student/api/assessmentApi.js";

export default function StudentSubmissionPage() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const toastRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!assignmentId) return;

        const load = async () => {
            try {
                setLoading(true);
                const res = await fetchStudentSubmissionSummary(assignmentId);
                setData(res);
            } catch (e) {
                console.error(e);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Không tải được thông tin bài nộp.",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [assignmentId]);

    const score = data?.score ?? null;
    const maxScore = data?.maxScore ?? null;
    const pct =
        data?.percentage ??
        (score != null && maxScore
            ? Math.round((Number(score) * 100) / Number(maxScore))
            : null);

    const renderStatusTag = () => {
        if (!data?.status) return null;
        const s = String(data.status).toUpperCase();
        let severity = "info";
        if (s === "GRADED") severity = "success";
        if (s === "SUBMITTED") severity = "warning";

        return <Tag value={s} severity={severity} />;
    };

    return (
        <div className="page-wrap">
            <Toast ref={toastRef} />

            <Card
                title={data?.assignmentTitle || "Submission"}
                subTitle={
                    data?.submittedAt
                        ? `Submitted at: ${new Date(
                            data.submittedAt
                        ).toLocaleString()}`
                        : undefined
                }
                loading={loading}
            >
                <div className="flex flex-column gap-3">
                    <div className="flex align-items-center gap-3">
                        <h3 className="m-0">
                            Score:{" "}
                            <strong>
                                {score ?? "-"} {maxScore != null && ` / ${maxScore}`}
                            </strong>
                        </h3>
                        {renderStatusTag()}
                    </div>

                    {pct != null && (
                        <div>
                            <p className="m-0 mb-2">Percentage</p>
                            <ProgressBar value={pct} />
                        </div>
                    )}

                    <p className="text-sm text-muted-color">
                        Đây là phần tổng hợp kết quả. Bạn chỉ xem được điểm và
                        trạng thái bài nộp, không thể xem lại câu hỏi hoặc đáp
                        án chi tiết.
                    </p>

                    <div className="flex gap-2 mt-3">
                        <Button
                            label="Back to assignments"
                            outlined
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
