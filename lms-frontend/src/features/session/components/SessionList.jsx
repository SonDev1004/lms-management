import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";

import EditSession from "./EditSession.jsx";
import AddSession from "./AddSession.jsx";
import AssignmentTeacherForm from "../../assignment/components/AssignmentTeacherForm.jsx";
import AssignmentTeacherList from "../../assignment/components/AssignmentTeacherList.jsx";
import SessionService from "@/features/session/api/sessionService.js";
// Nếu cần mock ban đầu thì import:
// import { mockAssignments } from "../../../mocks/mockAssignments";

function isToday(date) {
    const today = new Date();
    const d = new Date(date);
    return (
        today.getFullYear() === d.getFullYear() &&
        today.getMonth() === d.getMonth() &&
        today.getDate() === d.getDate()
    );
}

const SessionList = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // State
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sessionList, setSessionList] = useState([]);
    const [activeIndexes, setActiveIndexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addAssignmentId, setAddAssignmentId] = useState(null); // session.id đang giao bài
    const [assignments, setAssignments] = useState([]); // danh sách bài tập đã giao (mock/API)

    // Toast
    const toast = useRef(null);

    // Format ngày dd/mm
    const shortDate = (date) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        }).format(d);
    };

    // Load sessions từ API
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await SessionService.getSessionsByCourse(courseId);
                if (mounted) setSessionList(data || []);
            } catch (err) {
                if (mounted) setError(err?.message || "Could not load session list");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [courseId]);

    // Load assignments ban đầu từ mock hoặc API nếu có
    useEffect(() => {
        // Nếu dùng mock:
        // setAssignments(mockAssignments.filter(a => a.course_id === Number(courseId)));
        // Nếu dùng API thì fetch ở đây
        setAssignments([]); // Khởi tạo rỗng
    }, [courseId]);

    // Thêm buổi (demo, chưa gọi API create)
    const handleAdd = (newSession) => {
        setSessionList((list) => [
            ...list,
            {
                ...newSession,
                id: Date.now(),
                // Nếu API dùng 'order' thì nên set 'order' thay cho 'index'
                index: (list?.length || 0) + 1,
                studentCount: list?.[0]?.studentCount ?? list?.[0]?.student_count ?? 0,
                disabled: false,
            },
        ]);
        setShowAdd(false);
        toast.current?.show({
            severity: "success",
            summary: "Session added",
            detail: "Added successfully!",
            life: 1200,
        });
    };

    // Update buổi (demo, chưa call API update)
    const handleUpdate = (id, changedFields, newValues) => {
        setSessionList((list) => list.map((item) => (item.id === id ? { ...item, ...newValues } : item)));
        toast.current?.show({
            severity: "success",
            summary: "Updated",
            detail: "Update successful!",
            life: 1200,
        });
        setEditingId(null);
        console.log("[Session Inline Edit] Fields changed:", changedFields);
    };

    // Giao bài tập (add assignment mới vào state)
    const handleAssignmentSave = (data) => {
        setAssignments((prev) => [...prev, data]); // Thêm assignment mới
        toast.current?.show({
            severity: "success",
            summary: "Đã giao bài",
            detail: data?.title ? `“${data.title}” has been assigned` : "Assignment added successfully",
            life: 1500,
        });
        setAddAssignmentId(null);
    };

    // Toggle mở form Edit trong tab tương ứng
    const openEdit = (e, session, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setAddAssignmentId(null); // tắt Assignment nếu đang mở
        setEditingId(session.id);
        setActiveIndexes((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
    };

    // Toggle mở form Assignment trong tab tương ứng
    const openAssignment = (e, session, idx) => {
        e.preventDefault();
        e.stopPropagation();

        // Chặn giao bài cho buổi đã qua
        const isPast = new Date(session.date) < new Date();
        if (isPast) {
            toast.current?.show({
                severity: "warn",
                summary: "Cannot assign",
                detail: "This session is over, cannot assign homework.",
                life: 1800,
            });
            return;
        }

        setEditingId(null); // tắt Edit nếu đang mở
        setAddAssignmentId(session.id); // mở form giao bài cho đúng session
        setActiveIndexes((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
    };

    const showSessionList = () =>
        sessionList.map((session, index) => {
            // Tùy field API: nếu API trả 'order' & 'student_count' → dùng 2 dòng fallback bên dưới
            const orderOrIndex = session.index ?? session.order ?? index + 1;
            const studentCount = session.studentCount ?? session.student_count ?? 0;

            return (
                <AccordionTab
                    key={session.id}
                    disabled={session.disabled}
                    header={
                        <div className="flex justify-content-between align-items-center w-full">
                            <div className="flex align-items-center gap-2">
                                Session {orderOrIndex}: {shortDate(session.date)}
                                <Button
                                    icon="pi pi-pencil"
                                    tooltip="Edit session"
                                    tooltipOptions={{ position: 'top' }}
                                    rounded
                                    text
                                    onClick={(e) => openEdit(e, session, index)}
                                />
                                {/* Nút Giao bài tập: giữ UI từ bản kia, nhưng gọi openAssignment thay vì navigate */}
                                <Button
                                    icon="pi pi-paperclip"
                                    tooltip="Assignment"
                                    tooltipOptions={{ position: 'top' }}
                                    rounded
                                    text
                                    // disabled={!isToday(session.date)} // chỉ bật nếu là hôm nay
                                    onClick={(e) => openAssignment(e, session, index)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <p>No. Student: {studentCount}/{studentCount}</p>
                                <Button
                                    icon="pi pi-list-check"
                                    tooltip="Attendance"
                                    tooltipOptions={{ position: 'top' }}
                                    rounded
                                    text
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate(`/teacher/courses/${courseId}/sessions/${session.id}/attendance`, {
                                            state: { courseId, date: session.date },
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    }
                >
                    {editingId === session.id ? (
                        <EditSession session={session} onCancel={() => setEditingId(null)} onSave={handleUpdate} />
                    ) : addAssignmentId === session.id ? (
                        <AssignmentTeacherForm
                            session={session}
                            onCancel={() => setAddAssignmentId(null)}
                            onSave={handleAssignmentSave}
                        />
                    ) : (
                        <>
                            <div>{session.description}</div>
                            <div className="mt-2">
                                <b>Assigned homework:</b>
                                <AssignmentTeacherList sessionId={session.id} assignments={assignments} />
                            </div>
                        </>
                    )}
                </AccordionTab>
            );
        });

    return (
        <div>
            <h1>Session List</h1>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {!loading && !error && (
                <>
                    {!showAdd && (
                        <Button className="mb-2" label="Add Session" onClick={() => setShowAdd(true)} />
                    )}
                    {showAdd && <AddSession onCancel={() => setShowAdd(false)} onSave={handleAdd} />}

                    <Accordion
                        multiple
                        activeIndex={activeIndexes}
                        onTabChange={(e) => setActiveIndexes(e.index)}
                    >
                        {showSessionList()}
                    </Accordion>
                </>
            )}

            <Button className="mt-2" label="Back" onClick={() => navigate(-1)} />
            <Toast ref={toast} />
        </div>
    );
};

export default SessionList;
