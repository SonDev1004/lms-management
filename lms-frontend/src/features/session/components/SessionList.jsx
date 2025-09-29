//React
import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

//mock
import { sessions } from "../../../mocks/mockSession";
import { useNavigate } from "react-router-dom";
import { mockAssignments } from "../../../mocks/mockAssignment";

//Component
import EditSession from "./EditSession";
import AddSession from "./AddSession";
import AssignmentTeacherForm from "../../assignment/components/AssignmentTeacherForm";
import AssignmentTeacherList from "../../assignment/components/AssignmentTeacherList";

const SessionList = () => {
    const navigate = useNavigate();

    // State
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sessionList, setSessionList] = useState([...sessions]);
    const [activeIndexes, setActiveIndexes] = useState([]);
    const [assignments, setAssignments] = useState([...mockAssignments]);
    const [addAssignment, setAddAssignment] = useState(null);

    //Toast
    const toast = useRef(null);
    const show = (order) => {
        toast.current.show({
            severity: 'info',
            summary: 'Info',
            detail: `Bạn vừa bấm sửa buổi số ${order}`,
            life: 2000
        });
    };

    // Hàm format ngày thành dd/mm
    const shortDate = date => {
        const d = new Date(date);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        })
            .format(d)
            .replace(/-/g, '/');
    };

    //Handle
    //Xử lí thêm
    const handleAdd = (newSession) => {
        setSessionList(list => [...list, {
            ...newSession,
            id: Date.now(),
            order: list.length + 1,
            student_count: list[0]?.student_count || 0,
            disabled: false,
        }]);
        setShowAdd(false);
        toast.current.show({
            severity: "success",
            summary: "Đã thêm buổi học",
            detail: "Thêm thành công!",
            life: 1200
        });
        console.log("[Session Add] Added:", newSession);
    }
    //Xử lí lưu Assignment --BEGIN--
    const handleAssignmentSave = (data) => {
        setAssignments(prev => [...prev, data]); // Thêm assignment mới vào state
        toast.current?.show({
            severity: "success",
            summary: "Đã giao bài",
            detail: data?.title ? `“${data.title}” đã được giao` : "Giao bài thành công",
            life: 1500
        });
        setAddAssignment(null);
    };
    //Xử lí lưu Assignment --END--

    //Xử lí update:
    const handleUpdate = (id, changedFields, newValues) => {
        setSessionList(list => list.map(item => item.id === id ? { ...item, ...newValues } : item));
        //Toast udpate thành công:
        toast.current.show({
            severity: "success",
            summary: "Đã cập nhật",
            detail: "Cập nhật thành công!",
            life: 1200
        });
        setEditingId(null);
        console.log("[Session Inline Edit] Fields changed:", changedFields);
    }
    useEffect(() => {
        console.log("Updated activeIndexes:", activeIndexes);
    }, [activeIndexes]);

    //Đóng mở Edit và Assignmnet --BEGIN--
    const openEdit = (e, session, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setAddAssignment(null);         // tắt Assignment nếu đang mở
        setEditingId(session);        // bật Edit
        setActiveIndexes(prev => (prev.includes(idx) ? prev : [...prev, idx]));
    };

    const openAssignment = (e, session, idx) => {
        e.preventDefault();
        e.stopPropagation();
        const isPastSession = new Date(session.date) < new Date();
        if (isPastSession) {
            toast.current.show({
                severity: "warn",
                summary: "Không thể giao bài",
                detail: "Buổi này đã qua, không thể giao bài tập.",
                life: 1800,
            });
            return;
        }
        setEditingId(null); // tắt Edit nếu đang mở
        setAddAssignment(session.id); // mở form giao bài cho đúng session
        setActiveIndexes(prev => (prev.includes(idx) ? prev : [...prev, idx]));
    };
    //Đóng mở Edit và Assignmnet --END--

    const showSessionList = () => {
        return sessionList.filter(Boolean).map((session, index) =>
            <AccordionTab key={session.id} disabled={session.disabled}
                header={<div className="flex justify-content-between align-items-center w-full">
                    <div className="flex align-items-center gap-2">Buổi {session.order}: {shortDate(session.date)}
                        <Button onClick={(e) => openEdit(e, session.id, index)}>
                            <i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i>
                        </Button>
                        <Button onClick={(e) => openAssignment(e, session, index)}>
                            <i className="pi pi-paperclip" style={{ fontSize: '1rem' }}></i>
                        </Button>
                    </div>
                    <div className="flex">Sĩ số: {session.student_count}/{session.student_count} </div>
                </div>
                }
            >{editingId === session.id ? (
                <EditSession
                    session={session}
                    onCancel={() => setEditingId(null)}
                    onSave={handleUpdate}
                />
            ) : addAssignment === session.id ? (
                <AssignmentTeacherForm
                    session={session}
                    onCancel={() => setAddAssignment(null)}
                    onSave={handleAssignmentSave}
                />
            ) : (
                <div>
                    <div className="mb-2">{session.description}</div>
                    <div>
                        <strong>Bài tập đã giao cho buổi này:</strong>
                        <AssignmentTeacherList sessionId={session.id} assignments={assignments} />
                    </div>
                </div>
            )}
            </AccordionTab >
        );
    };

    return (
        <div>
            <h1>Danh sách buổi học</h1>
            {!showAdd && (
                <Button
                    className="mb-2"
                    label="Thêm buổi"
                    onClick={() => setShowAdd(true)}
                />
            )}
            {showAdd && (
                <AddSession
                    onCancel={() => setShowAdd(false)}
                    onSave={handleAdd}
                />
            )}
            <Accordion activeIndex={activeIndexes} multiple onTabChange={(e) => setActiveIndexes(e.index)}>
                {showSessionList()}
            </Accordion>
            <Button
                className="mt-2"
                label='Quay lại'
                onClick={() => navigate(-1)}
            />
            <Toast ref={toast} />
        </div >);
}

export default SessionList;