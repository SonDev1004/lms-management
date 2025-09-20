import React from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { statusMap, statusLabelMap, statusSeverityMap } from "../lib/courseStatus.js";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";


export default function CourseCardOverall({ course, role, onAction }) {
    console.log("CourseCardOverall", course, role, onAction);

    const statusText = statusMap[course.status] || "unknown";
    const footer = (<Button label="Chi tiết" onClick={() => navigate(`/teacher/courses/${course.id}`)} />);
    const navigate = useNavigate();
    //Đổi format Date
    function formatDateToDDMM(dateStr) {
        if (!dateStr) return "";
        const [yyyy, mm, dd] = dateStr.split("-");
        return `${dd}/${mm}`;
    }
    //Hiển thị thứ và thời gian của khóa học:
    const days = (course.schedule || []).map(s => s.day).join(", ");
    const times = Array.from(new Set((course.schedule || []).map(s => s.time)));
    const scheduleStr = times.length === 1
        ? `${days}, ${times[0]}`
        : `${days} | ${times.join(", ")}`;

    return (
        //Thuộc tính thẻ a trong Card
        <Card
            title={
                <div>
                    <a
                        className="text-xl font-bold hover:underline hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/teacher/courses/${course.id}`)}
                    >
                        {course.title}
                    </a>
                </div>
            }
            subTitle={<div className="text-sm">{course.subject_name}</div>}
            className=" mb-3 shadow-2 rounded-2xl h-full"
            footer={footer}
        >
            <div className="">
                <ul className="list-none p-0">
                    <li><i className="pi pi-calendar mr-2"></i>
                        {formatDateToDDMM(course.start_date)} - {formatDateToDDMM(course.end_date)}
                    </li>
                    <li><span className=""><i className="pi pi-clock mr-2"></i>
                        {scheduleStr}
                    </span></li>
                    <li><span className=""><i className="pi pi-building mr-2"></i>
                        {course.room}</span>
                    </li>
                </ul>
            </div>
            <div className="mb-2 text-gray-700">{course.description}</div>
            <div className="mb-2">
                <Badge value={`Buổi: ${course.current_session}/${course.plannedSession}`} className="mr-2" />
                <Badge
                    value={statusLabelMap[statusText]}
                    severity={statusSeverityMap[statusText]}
                />
            </div>

        </Card>
    );
}
