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
    getStudentCourses: `${rootAPI}/student/me/courses` ,

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
    sendNotification: `${rootAPI}/admin-it/notifications/send`,
    getScheduledNotifications: `${rootAPI}/admin-it/notifications/scheduled`,
    getAdminNotificationHistory: `${rootAPI}/admin-it/notifications/history`,
    // ===== Options & Search cho form gửi thông báo =====
    notificationTypes: `${rootAPI}/admin-it/notifications/types`,
    roleOptions: `${rootAPI}/admin-it/roles/options`,

    // Autocomplete (GET ?q=&page=&size=)
    searchUsers: `${rootAPI}/admin-it/search/users`,
    searchCourses: `${rootAPI}/admin-it/search/courses`,
    searchPrograms: `${rootAPI}/admin-it/search/programs`,
    //Assignment - Student side
    // Danh sách bài tập/quiz của học sinh theo khóa học
    // BE dự kiến: GET /student/courses/{courseId}/assignments
    getStudentAssignments: (courseId) => `${rootAPI}/student/courses/${courseId}/assignments`,

    //Assignment - Teacher / Academic Manager side
    // Danh sách assignment theo khóa học
    getTeacherAssignments: (courseId) => `${rootAPI}/teacher/courses/${courseId}/assignments`,

    // CRUD assignment (nếu dùng)
    createAssignment: `${rootAPI}/teacher/assignments`,
    updateAssignment: (id) => `${rootAPI}/teacher/assignments/${id}`,
    deleteAssignment: (id) => `${rootAPI}/teacher/assignments/${id}`,

    // Question Bank (ngân hàng đề)
    questionBankList: `${rootAPI}/teacher/question-bank`,
    questionBankListBySubject: `${rootAPI}/teacher/question-bank/list-questions-by-subject`,
    questionBankCreateMcq: `${rootAPI}/teacher/question-bank/mcq-single`,
    questionBankDeactivate: (id) => `${rootAPI}/teacher/question-bank/${id}`,

    // Cấu hình quiz cho assignment
    assignmentQuizConfig: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}/quiz-config`,

    // Student quiz flow
    studentStartQuiz: (assignmentId) =>
        `${rootAPI}/student/assignments/${assignmentId}/start`,
    studentGetQuiz: (assignmentId) =>
        `${rootAPI}/student/assignments/${assignmentId}/quiz`,
    studentSubmitQuiz: (assignmentId, submissionId) =>
        `${rootAPI}/student/assignments/${assignmentId}/submissions/${submissionId}/submit-quiz`,

    //Assignment - STUDENT
    studentAssignmentsByCourse: (courseId) =>
        `${rootAPI}/student/courses/${courseId}/assignments`,
    studentSubmissionSummary: (assignmentId) =>
        `${rootAPI}/student/assignments/${assignmentId}/submission-summary`,

    //Assignment - TEACHER
    teacherAssignmentsByCourse: (courseId) =>
        `${rootAPI}/teacher/courses/${courseId}/assignments`,
    teacherAssignmentStudents: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}/students`,
    teacherRemindStudent: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}/remind-not-submitted`,
    teacherPublishAssignment: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}/publish`,
    createTeacherAssignment: (courseId) =>
        `${rootAPI}/teacher/courses/${courseId}/assignments`,

    teacherAssignmentDetail: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}`,
    updateTeacherAssignment: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}`,
    deleteTeacherAssignment: (assignmentId) =>
        `${rootAPI}/teacher/assignments/${assignmentId}`,
    teacherRetakeRequests: (assignmentId) =>
        `${AppConfig.rootAPI}/teacher/assignments/${assignmentId}/retake-requests`,
    teacherHandleRetakeRequest: (requestId) =>
        `${AppConfig.rootAPI}/teacher/assignments/retake-requests/${requestId}/handle`,
    // Student attendance
    studentAttendanceOverview: `${rootAPI}/student/attendance/overview`,
    studentAttendanceDetails: `${rootAPI}/student/attendance/details`,

    // Student–sessions của 1 course (dùng cho Make-up + session details)
    studentCourseSessions: (courseId) =>
        `${rootAPI}/student/courses/${courseId}/sessions`,

    // Student – danh sách yêu cầu học bù của chính mình
    studentMakeupRequests: `${rootAPI}/student/makeup-requests/create`,
    requestAssignmentRetake: (assignmentId) =>
        `${rootAPI}/student/makeup-requests/assignments/${assignmentId}/retake-request`,

    // Academic Manager/AdminIT – danh sách yêu cầu học bù (phân trang)
    adminMakeupRequests: `${rootAPI}/admin/makeup-requests`,

    // Academic Manager/AdminIT – xác nhận đã học bù
    adminMarkMakeupAttended: (id) =>
        `${rootAPI}/admin/makeup-requests/${id}/mark-attended`,

    // Lịch giảng viên & học viên
    teacherSchedule: (from, to) =>
        `${rootAPI}/teacher/schedule?from=${from}&to=${to}`,
    academySchedule: (from, to) =>
        `${rootAPI}/academic/schedule?from=${from}&to=${to}`,
    studentSchedule: (from, to) =>
        `${rootAPI}/student/schedule?from=${from}&to=${to}`,
    createUser: `${rootAPI}/admin-it/users/create`,
    getAllRoles: `${rootAPI}/admin-it/roles`,

    // Latest enrollments (Admin IT) – list có filter + paging
    adminLatestEnrollments: `${rootAPI}/admin/enrollments/latest`,
    // Tuition Revenue – summary theo năm/tháng/chương trình/môn
    tuitionRevenueSummary: `${rootAPI}/admin/tuition-revenue/summary`,
    // Tuition Revenue – danh sách giao dịch chi tiết
    tuitionRevenueTransactions: `${rootAPI}/admin/tuition-revenue/transactions`,
    // Course Admin
    getAllCourses: `${rootAPI}/admin/courses/list-courses`,
    adminCourseSessions: (courseId) => `${rootAPI}/admin/courses/${courseId}/sessions`,
    adminCourseGenerateSessions: (courseId) => `${rootAPI}/admin/courses/${courseId}/sessions/generate`,
    adminCoursePublish: (courseId) => `${rootAPI}/admin/courses/${courseId}/publish`,
    adminCourseTimeslots: (courseId) => `${rootAPI}/admin/courses/${courseId}/timeslots`,
    adminCourseAddStudent: (courseId) => `${rootAPI}/admin/courses/${courseId}/students`,
    adminCourseAssignTeachers: (courseId) => `${rootAPI}/admin/courses/${courseId}/teacher`,
    createCourse: `${rootAPI}/admin/courses/create-courses-by-program`,
    searchTeachers: `${rootAPI}/admin-it/search/teachers`,
    programSubjectsOptions: (programId) => `${rootAPI}/program/${programId}/subjects`,
    roomOptions:`${rootAPI}/admin/courses/rooms-options`,
    adminCourseListTimeslots:(courseId)=> `${rootAPI}/admin/courses/${courseId}/list-timeslots`,
};
