import { useState } from "react";
import CourseList from "../../course/components/CourseList";
import { courses } from "../../../mocks/mockCourses.js";
import { statusMap } from "../../course/lib/courseStatus.js";

const TeacherCourses = () => {
    // Giả lập id giáo viên login (vd: teacher01 là id 39)
    const teacherId = 39;
    // Filter courses đúng giáo viên
    const coursesByTeacher = courses.filter(c => c.teacher_id === teacherId);

    // Tab trạng thái
    const [status, setStatus] = useState("all");
    const visibleCourses = status === "all"
        ? coursesByTeacher
        : coursesByTeacher.filter(c => statusMap[c.status] === status);

    //Khai báo hàm handleCourseAction để test n
    const handleCourseAction = (action, course) => {
        // Tùy vào action, bạn mở dialog, điều hướng, hoặc xử lý tùy ý
        if (action === "students") {
            alert(`Xem danh sách học viên cho lớp: ${course.title}`);
        } else if (action === "grading") {
            alert(`Chấm điểm lớp: ${course.title}`);
        } else if (action === "documents") {
            alert(`Xem tài liệu lớp: ${course.title}`);
        }
        // ... Xử lý thêm các action khác
        console.log("Action:", action, "Course:", course);
    };

    return (
        <CourseList
            courses={visibleCourses}
            loading={false}
            status={status}
            setStatus={setStatus}
            role="teacher"
            onAction={handleCourseAction} />
    );
}

export default TeacherCourses;