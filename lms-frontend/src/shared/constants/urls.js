import {AppConfig} from "@/shared/constants/index.js";

const rootAPI = AppConfig.rootAPI;

export default {

    //Endpoint Auth
    login: `${rootAPI}/auth/login`,
    logout: `${rootAPI}/auth/logout`,
    register: `${rootAPI}/auth/register`,
    refresh:`${rootAPI}/auth/refresh`,
    profile:`${rootAPI}/user/profile`,

    //Endpoint Student
    getStudentCourses:`${rootAPI}/student/me/courses`,

    //Lesson
    lessonBySubject: (id) => `${rootAPI}/lesson/by-subject/${id}`,

    //program
    listProgram: `${rootAPI}/program/all-program`,

    //subject
    listSubject: `${rootAPI}/subject/all-subject`,
}