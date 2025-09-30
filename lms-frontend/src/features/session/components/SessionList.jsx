import {useEffect, useRef, useState} from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {useNavigate, useParams} from "react-router-dom";

import EditSession from "./EditSession";
import AddSession from "./AddSession";

import SessionService from "@/features/session/api/sessionService.js";

const SessionList = () => {
    const navigate = useNavigate();
    const {courseId} = useParams(); // lấy từ URL: /teacher/courses/:courseId/sessions

    // State
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sessionList, setSessionList] = useState([]);
    const [activeIndexes, setActiveIndexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    //Toast
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
                console.log("Sessions API data:", data);
                if (mounted) setSessionList(data);
            } catch (err) {
                if (mounted) setError(err.message || "Không tải được danh sách buổi học");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false
        };
    }, [courseId]);


    // Thêm buổi (demo, chưa gọi API create)
    const handleAdd = (newSession) => {
        setSessionList((list) => [
            ...list,
            {
                ...newSession,
                id: Date.now(),
                index: list.length + 1,
                studentCount: list[0]?.studentCount || 0,
                disabled: false,
            },
        ]);
        setShowAdd(false);
        toast.current.show({
            severity: "success",
            summary: "Đã thêm buổi học",
            detail: "Thêm thành công!",
            life: 1200,
        });
    };

    // Update buổi (demo, chưa call API update)
    const handleUpdate = (id, changedFields, newValues) => {
        setSessionList((list) =>
            list.map((item) => (item.id === id ? {...item, ...newValues} : item))
        );
        toast.current.show({
            severity: "success",
            summary: "Đã cập nhật",
            detail: "Cập nhật thành công!",
            life: 1200,
        });
        setEditingId(null);
    };

    const showSessionList = () =>
        sessionList.map((session, index) => (
            <AccordionTab
                key={session.id}
                disabled={session.disabled}
                header={
                    <div className="flex justify-content-between align-items-center w-full">
                        <div className="flex align-items-center gap-2">
                            Buổi {session.index}: {shortDate(session.date)}
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEditingId(session.id);
                                    setActiveIndexes((prev) =>
                                        prev.includes(index) ? prev : [...prev, index]
                                    );
                                }}
                            >
                                <i className="pi pi-pencil" style={{fontSize: "1rem"}}></i>
                            </Button>
                            <Button
                                label="Điểm danh"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/teacher/courses/${courseId}/sessions/${session.id}/attendance`, {
                                        state: {courseId, date: session.date}
                                    });
                                }}
                            />


                        </div>
                        <div className="flex">
                            Sĩ số: {session.studentCount}/{session.studentCount}
                        </div>
                    </div>
                }
            >
                {editingId === session.id ? (
                    <EditSession
                        session={session}
                        onCancel={() => setEditingId(null)}
                        onSave={handleUpdate}
                    />
                ) : (
                    <div>{session.description}</div>
                )}
            </AccordionTab>
        ));

    return (
        <div>
            <h1>Danh sách buổi học</h1>
            {loading && <div>Đang tải...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {!loading && !error && (
                <>
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

                    <Accordion
                        activeIndex={activeIndexes}
                        multiple
                        onTabChange={(e) => setActiveIndexes(e.index)}
                    >
                        {showSessionList()}
                    </Accordion>
                </>
            )}

            <Button className="mt-2" label="Quay lại" onClick={() => navigate(-1)}/>
            <Toast ref={toast}/>
        </div>
    );
};

export default SessionList;
