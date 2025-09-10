import React, { useMemo, useState } from "react";
import "./CourseHome.css";
import CourseGrid from "@/features/course/components/CourseGrid.jsx";
import CourseFilterBar from "@/features/course/components/CourseFilterBar.jsx";

import { courses as mockCourses } from "@/mocks/mockCourses.js";
import { teachers } from "@/mocks/mockTeachers.js";
import { users } from "@/mocks/mockUsers.js";
const CourseHomeTeacher = () => {

    // Lấy username từ localStorage (khi đăng nhập hệ thống đã lưu)
    const username = localStorage.getItem("username");
    // Tìm user object từ username
    const user = users.find(u => u.user_name === username);
    // Tìm teacher từ user.id
    const teacher = user ? teachers.find(t => t.user_id === user.id) : null;
    const teacherId = teacher ? teacher.id : null;
    //Chưa login đúng -> ko render or báo lỗi
    // if (!user || !teacher) {
    //     return <div>Bạn chưa đăng nhập đúng tài khoản giáo viên.</div>;
    // }

    // Lọc các course mà giáo viên này dạy
    const courses = useMemo(() => {
        if (!teacherId) return [];
        return mockCourses
            .filter(c => c.teacher_id === teacherId)
            .map(c => {
                const now = new Date();
                const startDate = c.start_date ? new Date(c.start_date) : null;
                const hasStarted = startDate ? now >= startDate : false;
                const hasFinished = startDate ? now > startDate && c.status === 0 : false;
                const clickable = Boolean(c.status === 1 && hasStarted && !hasFinished);
                return { ...c, hasStarted, hasFinished, clickable };
            });
    }, [mockCourses, teacherId]);

    const [filter, setFilter] = useState("Tất cả");

    const counts = useMemo(() => ({
        "Tất cả": courses.length,
        "Đang dạy": courses.filter((c) => c.clickable).length,
        "Sắp mở": courses.filter((c) => !c.hasStarted).length,
        "Đã kết thúc": courses.filter((c) => c.hasFinished).length,
    }), [courses]);


    const visible = useMemo(() => {
        if (filter === "Đang dạy") return courses.filter((c) => c.clickable);
        if (filter === "Sắp mở") return courses.filter((c) => !c.hasStarted);
        if (filter === "Đã kết thúc") return courses.filter((c) => c.hasFinished);
        return courses;
    }, [courses, filter]);

    return (
        <div className="course-wrapper p-d-flex p-flex-column">
            <div className="controls" style={{ padding: "0 16px" }}>
                <CourseFilterBar
                    filter={filter}
                    counts={counts}
                    onChange={setFilter}
                    filters={["Tất cả", "Đang dạy", "Sắp mở", "Đã kết thúc"]}
                />
            </div>
            <CourseGrid items={visible} loading={false} error={null} />
        </div>
    );
}

export default CourseHomeTeacher;