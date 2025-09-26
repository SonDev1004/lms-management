//React
import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

//mock
import { sessions } from "../../../mocks/mockSession";
import { useNavigate } from "react-router-dom";

//Component
import EditSession from "./EditSession";
import AddSession from "./AddSession";

const SessionList = () => {
    const navigate = useNavigate();

    // State
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sessionList, setSessionList] = useState([...sessions]);
    // const [date, setDate] = useState(null);
    // const [description, setDescription] = useState("");
    const [activeIndexes, setActiveIndexes] = useState([]);

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

    const showSessionList = () => {
        return sessionList.filter(Boolean).map((session, index) =>
            <AccordionTab key={index} disabled={session.disabled}
                header={<div className="flex justify-content-between align-items-center w-full">
                    <div className="flex align-items-center gap-2">Buổi {session.order}: {shortDate(session.date)}
                        <Button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingId(session.id);
                            setActiveIndexes(prev => (prev.includes(index)) ? prev : [...prev, index]);
                        }}>
                            <i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i>
                        </Button>
                        <Button
                            label="Điểm danh"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate('attendance', { state: { date: session.date } });
                            }}
                        />
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
            ) : (
                <div>{session.description}</div>
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