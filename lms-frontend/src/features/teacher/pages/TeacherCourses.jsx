import {useEffect, useState} from "react";
import CourseList from "../../course/components/CourseList";
import { statusMap } from "../../course/lib/courseStatus.js";
import TeacherService from "@/features/teacher/api/teacherService.js";

const TeacherCourses = () => {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("all");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await TeacherService.getMyCourses();
                console.log(data);
                if (!mounted) return;
                setCourses(data.items ?? data.content ?? []);
            } catch (err) {
                console.error("Error loading teacher courses", err);
            } finally {
                setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Tab trạng thái
    const visibleCourses = status === "all"
        ? courses
        : courses.filter(c => statusMap[c.status] === status);

    return (
        <CourseList
            courses={visibleCourses}
            loading={loading}
            status={status}
            setStatus={setStatus}
            role="teacher"
         />
    );
}

export default TeacherCourses;