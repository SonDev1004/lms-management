import {AppUrls} from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";
import {mapTeacherCourse} from "@/features/teacher/lib/mapTeacherCourse.js";

async function getMyCourses() {
    const url = AppUrls.getTeacherCourses;
    const res = await axiosClient.get(url);
    console.log(res);
    return mapTeacherCourse(res.data)
}

const TeacherService = {
    getMyCourses,
};

export default TeacherService;