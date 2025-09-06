import React, { useMemo, useState } from "react";
import "./CourseHome.css";
import useMyCourses from "@/features/course/hooks/useMyCourses.js";
import CourseGrid from "@/features/course/components/CourseGrid.jsx";
import CourseFilterBar from "@/features/course/components/CourseFilterBar.jsx";

export default function CourseHome() {
    const { courses, loading, error } = useMyCourses();
    const [filter, setFilter] = useState("Tất cả");

    const counts = useMemo(() => ({
        "Tất cả": courses.length,
        "Đang học": courses.filter((c) => c.clickable).length,
        "Sắp mở":  courses.filter((c) => !c.hasStarted).length,
        "Đã học":  courses.filter((c) => c.hasFinished).length,
    }), [courses]);

    const visible = useMemo(() => {
        if (filter === "Đang học") return courses.filter((c) => c.clickable);
        if (filter === "Sắp mở")   return courses.filter((c) => !c.hasStarted);
        if (filter === "Đã học")   return courses.filter((c) => c.hasFinished);
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
