import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { useParams } from "react-router-dom";

const AssignmentTeacherForm = ({ defaultValues, onSave, onCancel, session }) => {
    const { courseId } = useParams();
    const toast = useRef(null);
    const [title, setTitle] = useState(defaultValues?.title || "");
    const [maxScore, setMaxScore] = useState(defaultValues?.max_score ?? 10);
    const [factor, setFactor] = useState(defaultValues?.factor ?? 0.1);
    const [dueDate, setDueDate] = useState(
        defaultValues?.due_date ? new Date(defaultValues.due_date) : null
    );
    const [file, setFile] = useState(null);

    // Tự động set ngày hạn nộp bằng ngày session nếu vào form lần đầu
    useEffect(() => {
        if (!dueDate && session?.date) {
            setDueDate(new Date(session.date));
        }
    }, [session]);

    const handleSave = () => {
        if (!title.trim()) {
            toast.current.show({ severity: "warn", summary: "Thiếu tiêu đề", detail: "Vui lòng nhập tiêu đề." });
            return;
        }
        if (!dueDate) {
            toast.current.show({ severity: "warn", summary: "Thiếu hạn nộp", detail: "Vui lòng chọn ngày giờ hạn nộp." });
            return;
        }
        //Check ngày giao bài đúng với buổi học, hạn nộp không được trước ngày giao bài --BEGIN--
        const assignDay = new Date(session.date);
        const dueDay = new Date(dueDate);
        //So sánh năm, tháng, ngày và trường hợp phải đúng ngày diễn ra buổi học
        const isValidDay = (
            assignDay.getFullYear() === dueDay.getFullYear() &&
            assignDay.getMonth() === dueDay.getMonth() &&
            assignDay.getDate() === dueDay.getDate()
        );

        if (!isValidDay) {
            toast.current.show({
                severity: "error",
                summary: "Ngày giao bài không hợp lệ",
                detail: `Ngày giao bài phải đúng ngày diễn ra buổi học (${assignDay.toLocaleDateString("vi-VN")})`,
                life: 2500
            });
            return;
        }
        //Check ngày giao bài đúng với buổi học, hạn nộp không được trước ngày giao bài --END--

        if (!courseId && !defaultValues?.course_id) {
            toast.current.show({ severity: "warn", summary: "Thiếu Course", detail: "Không xác định course_id." });
            return;
        }
        const payload = {
            id: defaultValues?.id ?? Date.now(),              // mock id
            title: title.trim(),
            max_score: Number(maxScore) || 0,
            file_name: file?.name || defaultValues?.file_name || null,
            factor: Number(factor) || 0,
            due_date: dueDate.toISOString(),                  // Lưu ISO string theo mock DB
            is_active: true,                                  //Luôn là true khi giao bài mới
            course_id: Number(courseId ?? defaultValues?.course_id),
            session_id: session.id,
        };

        onSave?.(payload);
        toast.current.show({ severity: "success", summary: "Đã giao bài", detail: "Tạo/giao bài thành công." });
    };
    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button label="Hủy" severity="secondary" onClick={() => onCancel?.()} />
            <Button label="Giao bài" icon="pi pi-send" onClick={handleSave} />
        </div>
    );
    return (<div>

        <Card
            className="w-30rem max-w-full"
            header={<h1 className="m-0 mb-3">Giao bài tập</h1>}
            footer={footer}
        >
            <Toast ref={toast} />
            <div className="flex flex-column gap-4">
                <span className="p-float-label">
                    <InputText
                        id="asg-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full"
                    />
                    <label htmlFor="asg-title">Tiêu đề</label>
                </span>
                <div className="grid">
                    <div className="col-6">
                        <span className="p-float-label w-full">
                            <InputNumber id="asg-max" value={maxScore} min={0} onValueChange={(e) => setMaxScore(e.value)} className="w-full" />
                            <label htmlFor="asg-max">Điểm tối đa (max_score)</label>
                        </span>
                    </div>
                    <div className="col-6">
                        <span className="p-float-label w-full">
                            <InputNumber
                                id="asg-factor"
                                value={factor}
                                min={0}
                                max={1}
                                step={0.05}
                                mode="decimal"
                                onValueChange={(e) => setFactor(e.value)}
                                className="w-full"
                            />
                            <label htmlFor="asg-factor">Hệ số (factor: 0→1)</label>
                        </span>
                    </div>
                </div>
                <span className="p-float-label w-full">
                    <Calendar
                        id="asg-due"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.value)}
                        showIcon
                        showTime
                        hourFormat="24"
                        className="w-full"
                    />
                    <label htmlFor="asg-due">Hạn nộp (due_date)</label>
                </span>
                <div className="flex flex-column gap-2">
                    <label className="text-500">Tệp đính kèm (file_name)</label>
                    <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    <small className="text-500">
                        {file?.name ? `Đã chọn: ${file.name}` : (defaultValues?.file_name ? `Hiện có: ${defaultValues.file_name}` : "Chưa chọn tệp")}
                    </small>
                </div>

                <small className="text-500">Course ID: {courseId ?? defaultValues?.course_id ?? "-"}</small>
            </div>
        </Card>

    </div>);
}

export default AssignmentTeacherForm;