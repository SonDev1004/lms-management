import React, { useMemo, useState } from "react";
import "./CourseHome.css";
import useMyCourses from "@/features/course/hooks/useMyCourses.js";
import CourseGrid from "@/features/course/components/CourseGrid.jsx";
import CourseFilterBar from "@/features/course/components/CourseFilterBar.jsx";

export default function CourseHome() {
    const { courses, loading, error } = useMyCourses();
    const [filter, setFilter] = useState("All");

    const counts = useMemo(() => ({
        "All": courses.length,
        "In Progress": courses.filter((c) => c.clickable).length,
        "Upcoming": courses.filter((c) => !c.hasStarted).length,
        "Completed": courses.filter((c) => c.hasFinished).length,
    }), [courses]);

    const visible = useMemo(() => {
        if (filter === "In Progress") return courses.filter((c) => c.clickable);
        if (filter === "Upcoming") return courses.filter((c) => !c.hasStarted);
        if (filter === "Completed") return courses.filter((c) => c.hasFinished);
        return courses;
    }, [courses, filter]);

    return (
        <div className="course-wrapper p-d-flex p-flex-column">
            <div className="controls" style={{ padding: "0 16px" }}>
                <CourseFilterBar filter={filter} counts={counts} onChange={setFilter} />
            </div>
            <CourseGrid items={visible} loading={loading} error={error} />
        </div>
    );
}
