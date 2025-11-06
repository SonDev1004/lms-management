import React from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { statusMap, statusLabelMap, statusSeverityMap } from "../lib/courseStatus.js";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";


export default function CourseCardOverall({ course, role, onAction }) {
    const navigate = useNavigate();

    const payload = {
        courseId: course.id,
        courseTitle: course.title,
        students: course.students ?? []
    };
    const goDetail = () => {
        navigate(`/teacher/courses/${course.id}`, { state: { payload } });
    };
    const footer = (<Button label="Details" onClick={goDetail} />);
    const statusText = statusMap[course.status] || "unknown";

    //Đổi format Date
    function formatDateToDDMM(dateStr) {
        if (!dateStr) return "";
        const [yyyy, mm, dd] = dateStr.split("-");
        return `${dd}/${mm}/${yyyy}`;
    }
    //Hiển thị thứ và thời gian của khóa học:
    const days = course.daysText || "";
    const times = course.timeText || "";

    const scheduleStr = days && times ? `${days}, ${times}` : days || times;

    return (
        //Thuộc tính thẻ a trong Card
        <Card
            title={
                <div>
                    <a
                        className="text-xl font-bold hover:underline hover:text-blue-600 cursor-pointer"
                        onClick={goDetail}
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
                        {formatDateToDDMM(course.startDate)}
                    </li>
                    <li><span className=""><i className="pi pi-clock mr-2"></i>
                        {scheduleStr}
                    </span></li>
                    <li><span className=""><i className="pi pi-building mr-2"></i>
                        {course.roomName}</span>
                    </li>
                </ul>
            </div>
            <div className="mb-2 text-gray-700">{course.description}</div>
            <div className="mb-2">
                <Badge value={`Session: ${course.sessionsDone}/${course.plannedSession}`} className="mr-2" />
                <Badge
                    value={statusLabelMap[statusText]}
                    severity={statusSeverityMap[statusText]}
                />
            </div>
        </Card>
    );
}
