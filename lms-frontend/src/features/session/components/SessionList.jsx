import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import { useNavigate, useParams } from "react-router-dom";

import AddSession from "./AddSession.jsx";
import EditSession from "./EditSession.jsx";

import AssignmentTeacherForm from "@/features/assignment/components/AssignmentTeacherForm.jsx";
import AssignmentTeacherList from "@/features/assignment/components/AssignmentTeacherList.jsx";

import SessionService from "@/features/session/api/sessionService.js";

export default function SessionList() {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const toast = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sessionList, setSessionList] = useState([]);
    const [expandedSessions, setExpandedSessions] = useState(new Set());

    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [addAssignmentId, setAddAssignmentId] = useState(null);
    const [assignments, setAssignments] = useState([]);

    const [courseStudentCount, setCourseStudentCount] = useState(0);

    // Pagination state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);

    const shortDate = (date) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(d);
    };

    const formatDayOfWeek = (date) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(d);
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const sessions = await SessionService.getSessionsByCourse(courseId);
                if (!mounted) return;

                setSessionList(sessions || []);

                const inferred =
                    sessions?.[0]?.studentCount ??
                    sessions?.[0]?.student_count ??
                    null;

                if (Number(inferred) > 0) {
                    setCourseStudentCount(Number(inferred));
                    return;
                }

                const total = await SessionService.getCourseStudentCount(courseId);
                if (!mounted) return;

                setCourseStudentCount(Number(total) || 0);
            } catch (e) {
                if (mounted) setError(e?.message || "Could not load sessions");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [courseId]);

    useEffect(() => {
        setAssignments([]);
    }, [courseId]);

    const toggleExpand = (sessionId) => {
        setExpandedSessions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
            } else {
                newSet.add(sessionId);
            }
            return newSet;
        });
    };

    const openEdit = (session) => {
        setAddAssignmentId(null);
        setEditingId(session.id);
        if (!expandedSessions.has(session.id)) {
            toggleExpand(session.id);
        }
    };

    const openAssignment = (session) => {
        const isPast = new Date(session.date) < new Date();
        if (isPast) {
            toast.current?.show({
                severity: "warn",
                summary: "Không thể giao bài",
                detail: "Buổi học đã qua, không thể giao bài tập.",
                life: 1800,
            });
            return;
        }

        setEditingId(null);
        setAddAssignmentId(session.id);
        if (!expandedSessions.has(session.id)) {
            toggleExpand(session.id);
        }
    };

    const handleAdd = (newSession) => {
        setSessionList((list) => [
            ...list,
            {
                ...newSession,
                id: Date.now(),
                index: (list?.length || 0) + 1,
                studentCount: courseStudentCount,
                disabled: false,
            },
        ]);

        setShowAdd(false);
        // Reset to first page to show the new session
        setFirst(0);
        toast.current?.show({
            severity: "success",
            summary: "Đã thêm buổi học",
            detail: "Thêm thành công!",
            life: 1200,
        });
    };

    const handleUpdate = (id, changedFields, newValues) => {
        setSessionList((list) => list.map((it) => (it.id === id ? { ...it, ...newValues } : it)));
        setEditingId(null);

        toast.current?.show({
            severity: "success",
            summary: "Đã cập nhật",
            detail: "Cập nhật thành công!",
            life: 1200,
        });

        console.log("[Session Inline Edit] Fields changed:", changedFields);
    };

    const handleAssignmentSave = (data) => {
        setAssignments((prev) => [...prev, data]);
        setAddAssignmentId(null);

        toast.current?.show({
            severity: "success",
            summary: "Đã giao bài",
            detail: data?.title ? `"${data.title}" đã được giao` : "Giao bài tập thành công",
            life: 1500,
        });
    };

    const renderSessionCard = (session, index) => {
        const orderOrIndex = session.index ?? session.order ?? index + 1;
        const perSession = session.studentCount ?? session.student_count ?? 0;
        const studentCount = Number(perSession) > 0 ? Number(perSession) : (courseStudentCount ?? 0);
        const isExpanded = expandedSessions.has(session.id);
        const isPast = new Date(session.date) < new Date();

        return (
            <Card
                key={session.id}
                className="mb-3 shadow-3 border-round-lg"
                style={{
                    borderLeft: isPast ? '4px solid #94a3b8' : '4px solid #3b82f6',
                    transition: 'all 0.3s ease'
                }}
            >
                <div className="flex justify-content-between align-items-start">
                    {/* Left Section - Session Info */}
                    <div className="flex-1">
                        <div className="flex align-items-center gap-3 mb-2">
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: isPast ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {orderOrIndex}
                            </div>

                            <div>
                                <h3 className="m-0 text-xl font-semibold text-900">
                                    Buổi học {orderOrIndex}
                                </h3>
                                <p className="m-0 mt-1 text-600 text-sm">
                                    {formatDayOfWeek(session.date)} - {shortDate(session.date)}
                                </p>
                            </div>

                            {isPast && (
                                <Badge
                                    value="Đã qua"
                                    severity="secondary"
                                    className="ml-2"
                                />
                            )}
                        </div>

                        {isExpanded && session.description && (
                            <div className="mt-3 p-3 bg-blue-50 border-round-md">
                                <p className="m-0 text-700 line-height-3">{session.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-column align-items-end gap-2 ml-3">
                        <div className="flex align-items-center gap-2 mb-2">
                            <i className="pi pi-users text-blue-500"></i>
                            <span className="font-semibold text-900">{studentCount}</span>
                            <span className="text-600 text-sm">học sinh</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-pencil"
                                tooltip="Chỉnh sửa"
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-button-text p-button-info"
                                onClick={() => openEdit(session)}
                            />

                            <Button
                                icon="pi pi-paperclip"
                                tooltip="Giao bài tập"
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-button-text p-button-warning"
                                onClick={() => openAssignment(session)}
                                disabled={isPast}
                            />

                            <Button
                                icon="pi pi-list-check"
                                tooltip="Điểm danh"
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-button-text p-button-success"
                                onClick={() => {
                                    navigate(`/teacher/courses/${courseId}/sessions/${session.id}/attendance`, {
                                        state: { courseId, date: session.date },
                                    });
                                }}
                            />

                            <Button
                                icon={isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
                                tooltip={isExpanded ? "Thu gọn" : "Xem chi tiết"}
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-button-text"
                                onClick={() => toggleExpand(session.id)}
                            />
                        </div>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <>
                        <Divider className="my-3" />

                        {editingId === session.id ? (
                            <div className="bg-white p-3 border-round-md">
                                <EditSession
                                    session={session}
                                    onCancel={() => setEditingId(null)}
                                    onSave={handleUpdate}
                                />
                            </div>
                        ) : addAssignmentId === session.id ? (
                            <div className="bg-white p-3 border-round-md">
                                <AssignmentTeacherForm
                                    session={session}
                                    onCancel={() => setAddAssignmentId(null)}
                                    onSave={handleAssignmentSave}
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <div className="flex align-items-center gap-2 mb-3">
                                    <i className="pi pi-book text-purple-500" style={{ fontSize: '1.2rem' }}></i>
                                    <h4 className="m-0 text-lg font-semibold text-900">Bài tập đã giao</h4>
                                </div>
                                <AssignmentTeacherList sessionId={session.id} assignments={assignments} />
                            </div>
                        )}
                    </>
                )}
            </Card>
        );
    };

    // Pagination handlers
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    // Get current page sessions
    const paginatedSessions = sessionList.slice(first, first + rows);

    return (
        <div className="p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="mb-4 p-4 bg-white border-round-lg shadow-2">
                <div className="flex justify-content-between align-items-center">
                    <div>
                        <h1 className="m-0 text-3xl font-bold text-900">
                            <i className="pi pi-calendar mr-3 text-blue-500"></i>
                            Danh sách buổi học
                        </h1>
                        <p className="mt-2 mb-0 text-600">Quản lý các buổi học của khóa học</p>
                    </div>

                    {!loading && !error && !showAdd && (
                        <Button
                            label="Thêm buổi học"
                            icon="pi pi-plus"
                            className="p-button-rounded"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                border: 'none'
                            }}
                            onClick={() => setShowAdd(true)}
                        />
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center p-5">
                    <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                    <p className="mt-3 text-600">Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Card className="bg-red-50 border-left-3 border-red-500">
                    <div className="flex align-items-center gap-3">
                        <i className="pi pi-exclamation-circle text-3xl text-red-500"></i>
                        <div>
                            <h4 className="m-0 text-red-800">Có lỗi xảy ra</h4>
                            <p className="mt-1 mb-0 text-red-600">{error}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <>
                    {showAdd && (
                        <Card className="mb-3 shadow-3 bg-blue-50">
                            <AddSession
                                onCancel={() => setShowAdd(false)}
                                onSave={handleAdd}
                            />
                        </Card>
                    )}

                    {sessionList.length === 0 ? (
                        <Card className="text-center p-5">
                            <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                            <h3 className="text-600">Chưa có buổi học nào</h3>
                            <p className="text-500">Nhấn "Thêm buổi học" để bắt đầu</p>
                        </Card>
                    ) : (
                        <div>
                            {paginatedSessions.map((session, index) => renderSessionCard(session, first + index))}

                            {/* Paginator */}
                            {sessionList.length > rows && (
                                <Card className="mt-3 shadow-2">
                                    <Paginator
                                        first={first}
                                        rows={rows}
                                        totalRecords={sessionList.length}
                                        rowsPerPageOptions={[5, 10, 15, 20]}
                                        onPageChange={onPageChange}
                                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                                        currentPageReportTemplate="Hiển thị {first} - {last} trong tổng số {totalRecords} buổi học"
                                        className="border-noround"
                                    />
                                </Card>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Footer */}
            <div className="mt-4 flex justify-content-between align-items-center">
                <Button
                    label="Quay lại"
                    icon="pi pi-arrow-left"
                    className="p-button-text"
                    onClick={() => navigate(-1)}
                />

                {!loading && !error && sessionList.length > 0 && (
                    <span className="text-600">
                        Tổng số: <strong className="text-900">{sessionList.length}</strong> buổi học
                    </span>
                )}
            </div>

            <Toast ref={toast} />
        </div>
    );
}