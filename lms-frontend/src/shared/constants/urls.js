import { AppConfig } from "@/shared/constants/index.js";

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

  //Program
  listProgram: `${rootAPI}/program/all-program`,
  getDetailProgram: (id) => `${rootAPI}/program/${id}/detail`,

  //Subject
  listSubject: `${rootAPI}/subject/all-subject`,
  getDetailSubject: (id) => `${rootAPI}/subject/${id}/detail`,

  //Payment
  payment: `${rootAPI}/v1/enrollments/create-payment`,
  resultPayment: (txnRef) => `${rootAPI}/v1/enrollments/result/${txnRef}`,
  vnpayReturn: (txnRef) => `${rootAPI}/v1/payments/vnpay-return/${txnRef}`,


  //Attendance
  getTeacherCourses: `${rootAPI}/teacher/me/courses`,
  getCourseSessions: (courseId) => `${rootAPI}/courses/${courseId}/sessions`,
  getSessionsByDate: `${rootAPI}/attendance/sessions`, // GET ?courseId&date
  getAttendanceBySession: (sessionId) => `${rootAPI}/attendance/by-session?sessionId=${sessionId}`,
  markAttendance: `${rootAPI}/attendance/mark`, // POST
  getAttendanceSummary: (courseId) => `${rootAPI}/attendance/summary?courseId=${courseId}`,

  // User notifications
  getMyNotifications: `${rootAPI}/notifications`,
  getUnseenNotifications: `${rootAPI}/notifications/unseen`,
  markAsSeen: (id) => `${rootAPI}/notifications/${id}/seen`,

  // AdminIT notifications
  sendNotification: `${rootAPI}/adminit/notifications/send`,
  getScheduledNotifications: `${rootAPI}/adminit/notifications/scheduled`,
  // ===== Options & Search cho form gửi thông báo =====
  notificationTypes: `${rootAPI}/adminit/notifications/types`,
  roleOptions: `${rootAPI}/adminit/roles/options`,
  // Autocomplete (GET ?q=&page=&size=)
  searchUsers: `${rootAPI}/adminit/search/users`,
  searchCourses: `${rootAPI}/adminit/search/courses`,
  searchPrograms: `${rootAPI}/adminit/search/programs`,

};
