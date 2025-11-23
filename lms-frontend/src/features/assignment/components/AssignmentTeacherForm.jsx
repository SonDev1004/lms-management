import {useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Card} from 'primereact/card';
import {Toast} from "primereact/toast";
import {InputNumber} from "primereact/inputnumber";
import {useParams} from "react-router-dom";
import {MultiSelect} from 'primereact/multiselect';

const AssignmentTeacherForm = ({defaultValues, onSave, onCancel, session}) => {
    const {courseId} = useParams();
    const toast = useRef(null);
    const [title, setTitle] = useState(defaultValues?.title || "");
    const [maxScore, setMaxScore] = useState(defaultValues?.max_score ?? 10);
    const [factor, setFactor] = useState(defaultValues?.factor ?? 0.1);
    const [dueDate, setDueDate] = useState(
        defaultValues?.due_date ? new Date(defaultValues.due_date) : null
    );
    const [file, setFile] = useState(null);
    const [selectedAssignmentType, setSelectedAssignmentType] = useState(null);
    const assignmentType = [
        {name: 'Home', code: 'HOME'},
        {name: 'Class', code: 'CLASS'},
        {name: 'Exam', code: 'EXAM'}
    ];


    // Tự động set ngày hạn nộp bằng ngày session nếu vào form lần đầu
    useEffect(() => {
        if (!dueDate && session?.date) {
            setDueDate(new Date(session.date));
        }
    }, [session]);

    const handleSave = () => {
        if (!title.trim()) {
            toast.current.show({severity: "warn", summary: "Missing title", detail: "Please enter a title."});
            return;
        }
        if (!dueDate) {
            toast.current.show({
                severity: "warn",
                summary: "Missing due date",
                detail: "Please select a due date and time."
            });
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
                summary: "Invalid assignment date",
                detail: `The assignment date must match the class session date (${assignDay.toLocaleDateString("en-US")}).`,
                life: 2500
            });
            return;
        }
        //Check ngày giao bài đúng với buổi học, hạn nộp không được trước ngày giao bài --END--

        if (!courseId && !defaultValues?.course_id) {
            toast.current.show({severity: "warn", summary: "Missing  Course", detail: "Course ID not found."});
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
            assignment_type: selectedAssignmentType?.map(t => t.code)
        };

        onSave?.(payload);
        toast.current.show({
            severity: "success",
            summary: "Assignment created",
            detail: "The assignment was successfully created/assigned."
        });
    };
    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" onClick={() => onCancel?.()}/>
            <Button label="Assign" icon="pi pi-send" onClick={handleSave}/>
        </div>
    );
    return (<div>

        <Card
            className="w-30rem w-full"
            header={<div className="flex justify-content-between align-items-center">
                <h1 className="m-0 mb-3">Assignment</h1>
                <Button
                    label="Add assignment"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={() => navigate(`/teacher/courses/${courseId}/assignment/add`)}
                />
            </div>
            }
            footer={footer}
        >
            <Toast ref={toast}/>
            <div className="flex flex-column gap-4">
                <span className="p-float-label w-full">
                    <InputText
                        id="asg-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full'
                    />
                    <label htmlFor="asg-title">Title</label>
                </span>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <span className="p-float-label w-full">
                            <InputNumber
                                id="asg-max"
                                value={maxScore}
                                min={0}
                                onValueChange={(e) => setMaxScore(e.value)}
                                className="w-full"
                            />
                            <label htmlFor="asg-max">Max Score</label>
                        </span>
                    </div>

                    <div className="flex-1">
                        <span className="p-float-label w-full">
                            {/* nếu đã đổi sang Dropdown thì thay MultiSelect bằng Dropdown */}
                            <MultiSelect
                                id="asg-type"
                                value={selectedAssignmentType}
                                onChange={(e) => setSelectedAssignmentType(e.value)}
                                options={assignmentType}
                                optionLabel="name"
                                placeholder="Choose assignment type"
                                maxSelectedLabels={3}
                                className="w-full"
                            />
                            <label htmlFor="asg-type">Assignment Type</label>
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
                        style={{width: '100%'}}
                    />
                    <label htmlFor="asg-due">Due Date</label>
                </span>
                <div className="flex flex-column gap-2">
                    <label className="text-500">Attached File</label>
                    <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}/>
                    <small className="text-500">
                        {file?.name ? `Selected: ${file.name}` : (defaultValues?.file_name ? `Current: ${defaultValues.file_name}` : "No file chosen")}
                    </small>
                </div>

                <small className="text-500">Course ID: {courseId ?? defaultValues?.course_id ?? "-"}</small>
            </div>
        </Card>

    </div>);
}

export default AssignmentTeacherForm;