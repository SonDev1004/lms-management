import {AppConfig} from "@/shared/constants/index.js";

const rootAPI = AppConfig.rootAPI;

export default {
  //Endpoint Auth
  login: `${rootAPI}/auth/login`,
  logout: `${rootAPI}/auth/logout`,
  register: `${rootAPI}/auth/register`,
  refresh: `${rootAPI}/auth/refresh`,
  profile: `${rootAPI}/user/profile`,

  //Endpoint Student
  getStudentCourses: `${rootAPI}/student/me/courses`,

  //Lesson
  lessonBySubject: (id) => `${rootAPI}/lesson/by-subject/${id}`,

  //program
  listProgram: `${rootAPI}/program/all-program`,
  getDetailProgram: (id) => `${rootAPI}/program/${id}/detail`,

  //subject
  listSubject: `${rootAPI}/subject/all-subject`,

  getDetailSubject: (id) => `${rootAPI}/subject/${id}/detail`,



    //payment
    payment: `${rootAPI}/v1/enrollments/create-payment`,
    resultPayment: (txnRef) => `${rootAPI}/v1/enrollments/result/${txnRef}`,

  //Attendance
  getTeacherCourses: `${rootAPI}/teacher/me/courses`,
  getSessionsByDate: `${rootAPI}/attendance/sessions`,              // GET ?courseId&date
  getAttendanceBySession: (sessionId) => `${rootAPI}/attendance/by-session?sessionId=${sessionId}`, // GET
  markAttendance: `${rootAPI}/attendance/mark`,                     // POST
  getAttendanceSummary: (courseId) => `${rootAPI}/attendance/summary?courseId=${courseId}` // GET
}

