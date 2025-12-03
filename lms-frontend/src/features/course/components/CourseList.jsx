import React from "react";
import { TabMenu } from "primereact/tabmenu";
import { ProgressSpinner } from "primereact/progressspinner";
import CourseCardOverall from "./CourseCardOverall.jsx";
import { statusLabelMap } from "../lib/courseStatus.js";

import "../styles/CourseList.css";

const courseStatus = [
    { label: "All", value: "all" },
    ...Object.entries(statusLabelMap).map(([key, label]) => ({
        label,
        value: key
    }))
];

export default function CourseList({ courses, loading, status, setStatus, role, onAction }) {
    const activeIndex = courseStatus.findIndex(tab => tab.value === status);

    return (
        <div className="course-list-root">
            {/* Tabs filter */}
            <TabMenu
                className="cl-tabmenu"
                model={courseStatus}
                activeIndex={activeIndex === -1 ? 0 : activeIndex}
                onTabChange={e => setStatus(courseStatus[e.index].value)}
            />

            {/* Grid courses */}
            <div className="grid course-grid">
                {loading ? (
                    <div className="course-loading">
                        <ProgressSpinner />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="course-empty">No class available</div>
                ) : (
                    courses.map(course => (
                        <div
                            key={course.id}
                            className="col-2 md:col-12 course-card-col"
                        >
                            <CourseCardOverall
                                course={course}
                                role={role}
                                onAction={onAction}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
