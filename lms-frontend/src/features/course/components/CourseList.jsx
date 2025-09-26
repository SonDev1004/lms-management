import React from "react";
import { TabMenu } from "primereact/tabmenu";
import CourseCardOverall from "./CourseCardOverall";
import { ProgressSpinner } from "primereact/progressspinner";
import { statusLabelMap } from "../lib/courseStatus";

const courseStatus = [
    { label: "Tất cả", value: "all" },
    //Tự động tạo ra một loạt option để hiển thị danh sách trạng thái.
    //convert các phần tử trong object thành label và value: key
    //kết quả sẽ là {label: "Đang học", value: "teaching"}
    ...Object.entries(statusLabelMap).map(([key, label]) => ({
        label, value: key
    }))
];

export default function CourseList({ courses, loading, status, setStatus, role, onAction }) {
    return (
        <div className="p-4">
            <TabMenu
                model={courseStatus}
                activeIndex={courseStatus.findIndex(tab => tab.value === status)}
                onTabChange={e => setStatus(courseStatus[e.index].value)}
            />

            <div className="grid mt-4 h-auto">
                {loading ? (
                    <ProgressSpinner />
                ) : (
                    courses.length === 0
                        ? <div className="w-full text-center text-gray-500">Không có lớp nào</div>
                        : courses.map(course => (
                            <div key={course.id} className="col-12 md:col-6 lg:col-4">
                                <CourseCardOverall course={course} role={role} onAction={onAction} />
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}
