//React
import { useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from 'primereact/toast';

//mock
import { sessions } from "../../../mocks/mockSession";
import { useNavigate } from "react-router-dom";


const SessionList = () => {
    const navigate = useNavigate();

    // State
    const [showAdd, setShowAdd] = useState(false);
    const [sessionList, setSessionList] = useState([...sessions]);
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState("");
    const toast = useRef(null);

    //Toast
    const show = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content' });
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

    // Xử lý lưu
    const handleSave = () => {
        if (!date || !description) {
            alert("Vui lòng nhập ngày và nội dung!");
            return;
        }
        const newSession = {
            id: Date.now(),
            order: sessionList.length + 1,
            date: date,
            description: description,
            student_count: sessionList[0]?.student_count || 0,
            disabled: false, // Đảm bảo có field này
        };
        setSessionList([...sessionList, newSession]);
        setShowAdd(false);
        setDate(null);
        setDescription("");
    };

    const showSessionList = () => {
        return sessionList.filter(Boolean).map(session => {
            if (!session) return null;
            return (
                <AccordionTab key={session.id} disabled={session.disabled}
                    header={<div className="flex justify-content-between align-items-center w-full">
                        <div className="flex align-items-center gap-2">Buổi {session.order}: {shortDate(session.date)}
                            <Button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.current?.show({
                                    severity: 'info',
                                    summary: 'Chỉnh sửa buổi học',
                                    detail: `Buổi ${session.order} - ${shortDate(session.date)}`,
                                    life: 2500,
                                });
                            }}>
                                <i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i>
                            </Button>
                        </div>

                        <div className="flex">Sĩ số: {session.student_count}/{session.student_count} </div>
                    </div>
                    }
                >
                    {session.description}
                </AccordionTab >

            );
        })
    };

    return (
        <div>
            <h1>Danh sách buổi học</h1>
            <Button
                className="mb-2"
                label="Thêm buổi"
                onClick={() => setShowAdd((v) => !v)}
            />
            {showAdd && (
                <div className="mb-3 p-3 shadow-4">
                    <div className="grid">
                        <div className="col-4 md:col-4">
                            <label className="block mb-2">Lựa chọn ngày</label>
                            <Calendar value={date} onChange={e => setDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                        </div>
                        <div className="col-8">
                            <label className="block mb-2">Nội dung buổi học</label>
                            <InputTextarea value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="col-12 mt-3">
                            <Button label="Lưu buổi học" icon="pi pi-check" onClick={handleSave} />
                        </div>
                    </div>
                </div>
            )}


            <Accordion>{showSessionList()}</Accordion>
            <Button
                className="mt-2"
                label='Quay lại'
                onClick={() => navigate(-1)}
            />
            <Toast ref={toast} />
        </div>);
}

export default SessionList;