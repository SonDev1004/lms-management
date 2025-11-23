import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import {
    fetchAssessment,
    saveAssessment,
    clearAssessment,
    submitQuiz,
} from "@/features/assignment/student/api/assessmentApi.js";

export default function StudentQuizPage() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeftSec, setTimeLeftSec] = useState(null);

    const [toastRef] = useState(null);

    const loadState = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAssessment(assignmentId);
            setState(data);
            setTimeLeftSec(data.timeLeftSec ?? data.durationMinutes * 60);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [assignmentId]);

    useEffect(() => {
        void loadState();
    }, [loadState]);

    // Timer
    useEffect(() => {
        if (!state || result) return;
        if (timeLeftSec === null) return;

        if (timeLeftSec <= 0) {
            handleAutoSubmit();
            return;
        }

        const id = setInterval(() => {
            setTimeLeftSec((prev) => {
                if (prev === null) return prev;
                const next = prev - 1;
                const newState = { ...state, timeLeftSec: Math.max(next, 0) };
                saveAssessment(assignmentId, newState);
                return next;
            });
        }, 1000);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, timeLeftSec, result]);

    const handleChooseOption = (qIndex, optionIndex) => {
        setState((prev) => {
            if (!prev) return prev;
            const questions = [...prev.questions];
            const q = { ...questions[qIndex], answer: optionIndex };
            questions[qIndex] = q;
            const nextState = { ...prev, questions };
            saveAssessment(assignmentId, nextState);
            return nextState;
        });
    };

    const handleChangeQuestion = (index) => {
        setState((prev) =>
            prev ? { ...prev, currentIndex: index + 1 } : prev
        );
    };

    const handleAutoSubmit = async () => {
        if (result) return;
        try {
            setSubmitting(true);
            const res = await submitQuiz(
                assignmentId,
                state.submissionId,
                state
            );
            setResult(res);
            clearAssessment(assignmentId);
        } catch (e) {
            console.error(e);
            toastRef?.show({
                severity: "error",
                summary: "Error",
                detail: "Không nộp được bài",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        confirmDialog({
            message: "Bạn chắc chắn muốn nộp bài?",
            header: "Nộp bài",
            icon: "pi pi-check",
            acceptLabel: "Nộp",
            rejectLabel: "Hủy",
            accept: handleAutoSubmit,
        });
    };

    if (loading) {
        return (
            <div className="page-wrap flex justify-content-center align-items-center">
                <i className="pi pi-spin pi-spinner mr-2" />
                Đang tải bài quiz...
            </div>
        );
    }

    if (!state) {
        return (
            <div className="page-wrap flex flex-column gap-3 align-items-center justify-content-center">
                <p>Không tải được bài quiz.</p>
                <Button label="Quay lại" onClick={() => navigate(-1)} />
            </div>
        );
    }

    const currentIndex = (state.currentIndex || 1) - 1;
    const currentQuestion = state.questions[currentIndex];

    const totalQuestions = state.questions.length || 1;
    const answeredCount = state.questions.filter(
        (q) => q.answer !== null && q.answer !== undefined
    ).length;

    const percent = Math.round((answeredCount / totalQuestions) * 100);

    const minutes = Math.floor((timeLeftSec ?? 0) / 60);
    const seconds = (timeLeftSec ?? 0) % 60;

    return (
        <div className="page-wrap">
            <Toast ref={toastRef} />
            <ConfirmDialog />
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-stopwatch title-icon" />
                    <div>
                        <h2 className="title">{state.title}</h2>
                        <p className="subtitle">
                            Trả lời tất cả câu hỏi trước khi hết thời gian.
                        </p>
                    </div>
                </div>

                <div className="flex flex-column align-items-end gap-2">
                    <div className="flex align-items-center gap-2">
                        <Tag
                            value={`Time left: ${minutes
                                .toString()
                                .padStart(2, "0")}:${seconds
                                .toString()
                                .padStart(2, "0")}`}
                            severity={
                                timeLeftSec <= 60
                                    ? "danger"
                                    : timeLeftSec <= 300
                                        ? "warning"
                                        : "info"
                            }
                        />
                        <Tag
                            value={`${answeredCount}/${totalQuestions} answered`}
                            severity="success"
                        />
                    </div>
                    <ProgressBar value={percent} style={{ width: "260px" }} />
                </div>
            </div>

            <div className="quiz-layout flex gap-3">
                {/* Sidebar: list câu hỏi */}
                <Card className="w-3">
                    <h3 className="mb-3">Questions</h3>
                    <div className="flex flex-wrap gap-2">
                        {state.questions.map((q, idx) => {
                            const isCurrent = idx === currentIndex;
                            const answered =
                                q.answer !== null && q.answer !== undefined;
                            return (
                                <Button
                                    key={q.id}
                                    label={String(idx + 1)}
                                    className="p-button-sm"
                                    outlined={!isCurrent}
                                    severity={
                                        answered
                                            ? "success"
                                            : isCurrent
                                                ? "info"
                                                : "secondary"
                                    }
                                    onClick={() => handleChangeQuestion(idx)}
                                />
                            );
                        })}
                    </div>
                </Card>

                {/* Main: nội dung câu hỏi */}
                <Card className="flex-1">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h3>
                            Câu {currentIndex + 1} / {totalQuestions}
                        </h3>
                        <Tag
                            value={`${currentQuestion.points ?? 1} pts`}
                            severity="info"
                        />
                    </div>

                    <p className="mb-4 text-lg">{currentQuestion.meta?.title}</p>

                    <div className="flex flex-column gap-2">
                        {(currentQuestion.options || []).map((opt, idx) => {
                            const label =
                                typeof opt === "string"
                                    ? opt
                                    : opt.text || opt.label || `Option ${idx + 1}`;
                            return (
                                <div
                                    key={idx}
                                    className="flex align-items-center gap-2 p-2 border-round surface-100"
                                    onClick={() => handleChooseOption(currentIndex, idx)}
                                >
                                    <RadioButton
                                        inputId={`q${currentQuestion.id}_o${idx}`}
                                        checked={currentQuestion.answer === idx}
                                        onChange={() =>
                                            handleChooseOption(currentIndex, idx)
                                        }
                                    />
                                    <label
                                        htmlFor={`q${currentQuestion.id}_o${idx}`}
                                        className="cursor-pointer"
                                    >
                                        {label}
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-content-between mt-4">
                        <Button
                            label="Previous"
                            outlined
                            disabled={currentIndex === 0}
                            onClick={() =>
                                handleChangeQuestion(Math.max(currentIndex - 1, 0))
                            }
                        />
                        <div className="flex gap-2">
                            <Button
                                label="Next"
                                outlined
                                disabled={currentIndex === totalQuestions - 1}
                                onClick={() =>
                                    handleChangeQuestion(
                                        Math.min(
                                            currentIndex + 1,
                                            totalQuestions - 1
                                        )
                                    )
                                }
                            />
                            <Button
                                label={submitting ? "Submitting..." : "Submit"}
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                disabled={submitting || !!result}
                            />
                        </div>
                    </div>

                    {result && (
                        <div className="mt-4 border-top pt-3">
                            <h4>Kết quả</h4>
                            <p>
                                Score:{" "}
                                <strong>
                                    {result.score}/{result.maxScore}
                                </strong>{" "}
                                ({result.percentage}%)
                            </p>
                            <p>Status: {result.status}</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
