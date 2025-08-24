import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from 'pages/home/Login';
import Register from 'pages/home/Register';
import UserProfile from './pages/home/UserProfile';
import Guest from './pages/home/Guest';
import './styles/custom-theme.css';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import LayoutStudent from 'layouts/student/LayoutStudent';
import StudentDashboard from 'pages/student/StudentDashboard';
import StudentCourses from 'pages/student/StudentCourses';
import StudentSchedule from 'pages/student/StudentSchedule';
import StudentEnrollment from 'pages/student/StudentEnrollment';
import StudentNoti from 'pages/student/StudentNoti';
import StudentScore from 'pages/student/StudentScore';

import LayoutTeacher from 'layouts/teacher/LayoutTeacher';
import TeacherDashboard from 'pages/teacher/TeacherDashboard';
import TeacherCourses from 'pages/teacher/TeacherCourses';
import TeacherSchedule from 'pages/teacher/TeacherSchedule';
import TeacherNoti from 'pages/teacher/TeacherNoti';

import LayoutAdmin from 'layouts/admin/LayoutAdmin';
import AdminDashboard from 'pages/admin/AdminDashboard';
import AdminSystems from 'pages/admin/AdminSystems';
import AdminSecurity from 'pages/admin/AdminSecutiry';
import AdminUpload from 'pages/admin/AdminUpload';

import LayoutAcademicManager from 'layouts/academic_manager/LayoutAcademicManager';
import AMDashboard from 'pages/academic_manager/AMDashboard';
import AMProgram from 'pages/academic_manager/AMProgram';
import AMCourse from 'pages/academic_manager/AMCourse';
import AMTeacher from 'pages/academic_manager/AMTeacher';
import AMStudent from 'pages/academic_manager/AMStudent';
import AMFeedback from 'pages/academic_manager/AMFeedback';
import AMSchedule from 'pages/academic_manager/AMSchedule';
import AMReport from 'pages/academic_manager/AMReport';
import AMNoti from 'pages/academic_manager/AMNoti';

import CourseHome from 'pages/course/CourseHome.jsx';
import CourseDetailStudent from "pages/student/course/CourseDetailStudent.jsx";
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/home/Unauthorized';


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home Route */}
                <Route path='/' element={<LayoutHome />} >
                    <Route index element={<Guest />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route>

                {/* Student Route */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route path='student' element={<LayoutStudent />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path='courses' element={<StudentCourses />} />
                        <Route path='schedule' element={<StudentSchedule />} />
                        <Route path='score' element={<StudentScore />} />
                        <Route path='enrollment' element={<StudentEnrollment />} />
                        <Route path='noti' element={<StudentNoti />} />

                        {/* Nested: student/course */}
                        <Route path="course">
                            <Route index element={<CourseHome />} />
                            <Route path="detail" element={<CourseDetailStudent />} />
                        </Route>
                    </Route>
                </Route>
                {/* Course Route (ngoài student) */}
                <Route path='course'>
                    <Route path='home' element={<CourseHome />} />
                </Route>


                {/* Teacher Route */}
                <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
                    <Route path='teacher' element={<LayoutTeacher />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route path='courses' element={<TeacherCourses />} />
                        <Route path='schedule' element={<TeacherSchedule />} />
                        <Route path='noti' element={<TeacherNoti />} />
                        <Route path='profile' element={<UserProfile />} />
                    </Route>
                </Route>

                {/* academic_manager Route */}
                <Route path='staff' element={<ProtectedRoute allowedRoles={['ACADEMIC_MANAGER']}><LayoutAcademicManager /></ProtectedRoute>}>
                    <Route index element={<AMDashboard />} />
                    <Route path='program' element={<AMProgram />} />
                    <Route path='courses' element={<AMCourse />} />
                    <Route path='teacher' element={<AMTeacher />} />
                    <Route path='student' element={<AMStudent />} />
                    <Route path='feedback' element={<AMFeedback />} />
                    <Route path='schedule' element={<AMSchedule />} />
                    <Route path='report' element={<AMReport />} />
                    <Route path='noti' element={<AMNoti />} />
                    <Route path='profile' element={<UserProfile />} />
                </Route>

                {/* Admin Route */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN_IT']} />}>
                    <Route path='admin' element={<LayoutAdmin />} >
                        <Route index element={<AdminDashboard />} />
                        <Route path='systems' element={<AdminSystems />} />
                        <Route path='upload' element={<AdminUpload />} />
                        <Route path='security' element={<AdminSecurity />} />
                    </Route>
                </Route>

                {/* Trang lỗi phân quyền */}
                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </BrowserRouter >
    );
}

export default App;

