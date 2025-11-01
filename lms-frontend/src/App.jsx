import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from '@/features/auth/pages/Login.jsx';
import Register from '@/features/auth/pages/Register.jsx';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/custom-theme.css';

import LayoutStudent from 'layouts/student/LayoutStudent';
import StudentDashboard from '@/features/student/pages/StudentDashboard.jsx';
import StudentCourses from '@/features/student/pages/StudentCourses.jsx';
import StudentSchedule from '@/features/student/pages/StudentSchedule.jsx';
import StudentEnrollment from '@/features/student/pages/StudentEnrollment.jsx';
import StudentScore from '@/features/student/pages/StudentScore.jsx';
import StudentList from '@/features/student/components/StudentList.jsx';

import LayoutTeacher from 'layouts/teacher/LayoutTeacher';
import TeacherDashboard from '@/features/teacher/pages/TeacherDashboard.jsx';
import TeacherCourses from '@/features/teacher/pages/TeacherCourses.jsx';
import TeacherSchedule from '@/features/teacher/pages/TeacherSchedule.jsx';
import TeacherNotification from '@/features/teacher/pages/TeacherNotification.jsx';
import AttendanceTeacherPanel from './features/attendance/components/AttendanceTeacherPanel.jsx';
import AttendanceTeacherSummary from './features/attendance/components/AttendanceTeacherSummary.jsx';
import CourseDetailTeacher from './features/course/pages/CourseDetailTeacher.jsx';

import LayoutAdmin from 'layouts/admin/LayoutAdmin';
import AdminDashboard from '@/features/admin/pages/AdminDashboard.jsx';
import AdminSystems from '@/features/admin/pages/AdminSystems.jsx';
import AdminSecurity from '@/features/admin/pages/AdminSecurity.jsx';
import AdminUpload from '@/features/admin/pages/AdminUpload.jsx';

import LayoutAcademicManager from 'layouts/academic_manager/LayoutAcademicManager';
import AMDashboard from '@/features/academic_manager/pages/AMDashboard.jsx';
import AMProgram from '@/features/academic_manager/pages/AMProgram.jsx';
import AMCourse from '@/features/academic_manager/pages/AMCourse.jsx';
import AMTeacher from '@/features/academic_manager/pages/AMTeacher.jsx';
import AMStudent from '@/features/academic_manager/pages/AMStudent.jsx';
import AMSchedule from '@/features/academic_manager/pages/AMSchedule.jsx';
import AMReport from '@/features/academic_manager/pages/AMReport.jsx';
import AMNotification from '@/features/academic_manager/pages/AMNotification.jsx';
import ProgramDetail from './features/program/pages/ProgramDetail.jsx';

import CourseDetailStudent from '@/features/course/pages/CourseDetailStudent.jsx';
import StudentNotification from '@/features/student/pages/StudentNotification.jsx';
import StudentProfile from '@/features/student/pages/StudentProfile.jsx';
import ProtectedRoute from '@/app/router/ProtectedRoute.jsx';
import AMProfile from '@/features/academic_manager/pages/AMProfile.jsx';
import TeacherProfile from '@/features/teacher/pages/TeacherProfile.jsx';
import AdminProfile from '@/features/admin/pages/AdminProfile.jsx';
import Unauthorized from '@/features/auth/pages/Unauthorized.jsx';
import SubjectDetail from '@/features/subject/detail/pages/SubjectDetail.jsx';
import ProgramList from '@/features/program/pages/ProgramList.jsx';
import SubjectList from '@/features/subject/pages/SubjectList.jsx';
import PaymentSuccess from "@/features/payment/pages/PaymentSuccess.jsx";
import PaymentFailed from "@/features/payment/pages/PaymentFailed.jsx";
import PaymentCancelled from "@/features/payment/pages/PaymentCancelled.jsx";
import SessionList from './features/session/components/SessionList.jsx';
import AMCourseDetail from "@/features/academic_manager/pages/AMCourseDetail.jsx";
import AMProgramDetail from "@/features/academic_manager/pages/AMProgramDetail.jsx";
import Home from "@/features/home/pages/Home.jsx";
import ProgramDetailPage from "@/features/program/detail/pages/ProgramDetailPage.jsx";
import { FeedbackPage } from "@/features/feedback/index.js";
import PaymentPage from "@/features/payment/pages/PaymentPage.jsx";
import UserProfile from "@/features/user/pages/UserProfile.jsx";
import StudentManagement from "@/features/academic_manager/list/student/pages/StudentManagement.jsx";
import TeacherManagement from "@/features/academic_manager/list/teacher/pages/TeacherManagement.jsx";
import Exercise from "@/features/assignment/student/pages/Exercise.jsx";
import ExerciseBuilder from "@/features/assignment/teacher/index.jsx";
import MStudentProfile from "@/features/academic_manager/profile/student/pages/StudentProfile.jsx";
import AMTeacherProfile from "@/features/academic_manager/pages/AMTeacherProfile.jsx";
import AttendancePage from "@/features/attendance/teacher/pages/AttendancePage.jsx";
import AttendanceDetailPage from "@/features/attendance/teacher/detail/pages/AttendanceDetailPage.jsx";
import TeacherAttendance from "@/features/teacher/pages/TeacherAttendance.jsx";
import StudentAttendance from "@/features/student/pages/StudentAttendance.jsx";
import RecentActivity from "@/features/recentactivity/pages/RecentActivity.jsx";
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home Route */}
                <Route path="/" element={<LayoutHome />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="programs" element={<ProgramList />} />
                    <Route path="programs/:id" element={<ProgramDetailPage />} />
                    <Route path="userprofile" element={<UserProfile />} />
                    <Route path="subjects" element={<SubjectList />} />
                    <Route path="subjects/:id" element={<SubjectDetail />} />
                    <Route path="payment" element={<PaymentPage />} />
                    <Route path="payment-success" element={<PaymentSuccess />} />
                    <Route path="payment-failed" element={<PaymentFailed />} />
                    <Route path="payment-cancelled" element={<PaymentCancelled />} />
                </Route>

                {/* Program Route (ngoài student) */}
                <Route path='program' element={<LayoutHome />}>
                    <Route path=':id' element={<ProgramDetail />} />
                </Route>
                {/* Subject Route (ngoài student) */}
                <Route path='subject' element={<LayoutHome />}>
                    <Route path=':id' element={<SubjectDetail />} />
                </Route>

                {/* Student Route */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route path='student' element={<LayoutStudent />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path='courses' element={<StudentCourses />} />
                        <Route path='courses/:slug' element={<CourseDetailStudent />} />
                        <Route path='schedule' element={<StudentSchedule />} />
                        <Route path='score' element={<StudentScore />} />
                        <Route path='assignment' element={<Exercise />} />
                        <Route path='enrollment' element={<StudentEnrollment />} />
                        <Route path='notification' element={<StudentNotification />} />
                        <Route path='attendance' element={<StudentAttendance />} />
                        <Route path='profile' element={<StudentProfile />} />
                    </Route>
                </Route>

                {/* Teacher Route */}
                <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
                    <Route path="teacher" element={<LayoutTeacher />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route path="courses" element={<TeacherCourses />} />
                        <Route path="courses/:courseId" element={<CourseDetailTeacher />}>
                            <Route index element={<SessionList />} />
                            <Route path="student-list" element={<StudentList />} />
                            <Route path="sessions/:sessionId/attendance" element={<AttendanceTeacherPanel />} />
                            <Route path="sessions/:sessionId/attendance/full" element={<AttendanceTeacherSummary />} />
                        </Route>
                        <Route path='assignment' element={<ExerciseBuilder />} />
                        <Route path="attendance" element={<TeacherAttendance/>} />
                        <Route path="attendance/detail/:classId" element={<AttendanceDetailPage />} />
                        <Route path="schedule" element={<TeacherSchedule />} />
                        <Route path="notification" element={<TeacherNotification />} />
                        <Route path="profile" element={<TeacherProfile />} />
                    </Route>
                </Route>

                {/* Academic Manager Route */}
                <Route element={<ProtectedRoute allowedRoles={['ACADEMIC_MANAGER']} />}>
                    <Route path='staff' element={<LayoutAcademicManager />}>
                        <Route index element={<AMDashboard />} />
                        <Route path='program' element={<AMProgram />} />
                        <Route path='detail/:id' element={<AMProgramDetail />} />
                        <Route path='courses' element={<AMCourse />}>
                            <Route path='detail/:id' element={<AMCourseDetail />} />
                        </Route>
                        <Route path="feedback" element={<FeedbackPage />} />
                        <Route path='teacher' element={<AMTeacher />} />
                        <Route path='teacher-list' element={<TeacherManagement />} />
                        <Route path='teacher-list/:id' element={<AMTeacherProfile/>} />
                        <Route path='student' element={<AMStudent />} />
                        <Route path='student-manager' element={<StudentManagement />} />
                        <Route path="student-manager/:id" element={<MStudentProfile />} />
                        <Route path='schedule' element={<AMSchedule />} />
                        <Route path='report' element={<AMReport />} />
                        <Route path='notification' element={<AMNotification />} />
                        <Route path='attendance' element={<AttendancePage />} />
                        <Route path='profile' element={<AMProfile />} />

                    </Route>
                </Route>

                {/* Admin Route */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN_IT']} />}>
                    <Route path='admin' element={<LayoutAdmin />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path='systems' element={<AdminSystems />} />
                        <Route path='upload' element={<AdminUpload />} />
                        <Route path='security' element={<AdminSecurity />} />
                        <Route path='profile' element={<AdminProfile />} />
                        <Route path='recentactivity' element={<RecentActivity />}/>
                    </Route>
                </Route>

                <Route path='/unauthorized' element={<Unauthorized />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
