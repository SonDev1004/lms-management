import React from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
//import trạng thái từ file courseStatus.js
import { statusMap, statusLabelMap, statusSeverityMap } from "../lib/courseStatus.js";
import CourseActions from "./CourseAction.jsx";
import { Button } from "primereact/button";


export default function CourseCardOverall({ course, role, onAction }) {
    const statusText = statusMap[course.status] || "unknown";
    const footer = (<CourseActions role={role} course={course} onAction={onAction} />);
    return (
        <Card
            title={
                <div className="flex align-items-center justify-between">
                    <span className="text-xl font-bold">{course.title}</span>
                    <Button severity="secondary" label={`Học viên: ${course.student_count}/${course.student_capacity}`} />
                </div>
            }
            subTitle={<span className="text-sm">{course.subject_name}</span>}
            className="mb-3 shadow-2 rounded-2xl"
            footer={footer}
        >
            <div className="mb-2">
                <i className="pi pi-calendar"></i> {course.start_date} - {course.end_date}
                <span className="ml-3"><i className="pi pi-clock"></i>
                    {(course.schedule || []).map(s => `${s.day} ${s.time}`).join(", ")}
                </span>
                <span className="ml-3"><i className="pi pi-building"></i> {course.room}</span>
            </div>
            <div className="mb-2 text-gray-700">{course.description}</div>
            <div className="mb-2">
                <Badge value={`Buổi: ${course.current_session}/${course.total_session}`} className="mr-2" />
                <Badge
                    value={statusLabelMap[statusText]}
                    severity={statusSeverityMap[statusText]}
                />
            </div>

        </Card>
    );
}
