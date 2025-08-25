import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from 'pages/home/Login';
import Register from 'pages/home/Register';
import Guest from './pages/home/Guest';
import './styles/custom-theme.css';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import LayoutStudent from 'layouts/student/LayoutStudent';
import StudentDashboard from 'pages/roles/student/StudentDashboard';
import StudentCourses from 'pages/roles/student/StudentCourses';
import StudentSchedule from 'pages/roles/student/StudentSchedule';
import StudentEnrollment from 'pages/roles/student/StudentEnrollment';
import StudentScore from 'pages/roles/student/StudentScore';

import LayoutTeacher from 'layouts/teacher/LayoutTeacher';
import TeacherDashboard from 'pages/roles/teacher/TeacherDashboard';
import TeacherCourses from 'pages/roles/teacher/TeacherCourses';
import TeacherSchedule from 'pages/roles/teacher/TeacherSchedule';
import TeacherNotification from 'pages/roles/teacher/TeacherNotification.jsx';

import LayoutAdmin from 'layouts/admin/LayoutAdmin';
import AdminDashboard from 'pages/roles/admin/AdminDashboard';
import AdminSystems from 'pages/roles/admin/AdminSystems';
import AdminSecurity from 'pages/roles/admin/AdminSecutiry';
import AdminUpload from 'pages/roles/admin/AdminUpload';

import LayoutAcademicManager from 'layouts/academic_manager/LayoutAcademicManager';
import AMDashboard from 'pages/roles/academic_manager/AMDashboard';
import AMProgram from 'pages/roles/academic_manager/AMProgram';
import AMCourse from 'pages/roles/academic_manager/AMCourse';
import AMTeacher from 'pages/roles/academic_manager/AMTeacher';
import AMStudent from 'pages/roles/academic_manager/AMStudent';
import AMFeedback from 'pages/roles/academic_manager/AMFeedback';
import AMSchedule from 'pages/roles/academic_manager/AMSchedule';
import AMReport from 'pages/roles/academic_manager/AMReport';
import AMNotification from 'pages/roles/academic_manager/AMNotification.jsx';

import CourseHome from 'pages/course/CourseHome.jsx';
import CourseDetailStudent from "pages/course/detail/CourseDetailStudent.jsx";
import UserProfile from "pages/profile/UserProfile.jsx";
import StudentNotification from "pages/roles/student/StudentNotification.jsx";
import StudentProfile from "pages/roles/student/StudentProfile.jsx";
import ProtectedRoute from "components/ProtectedRoute.jsx";
import AMProfile from "pages/roles/academic_manager/AMProfile.jsx";
import TeacherProfile from "pages/roles/teacher/TeacherProfile.jsx";
import AdminProfile from "pages/roles/admin/AdminProfile.jsx";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home Route */}
                <Route path='/' element={<LayoutHome/>}>
                    <Route index element={<Guest/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>


                </Route>

                {/* Student Route */}

                <Route path='student' element={<LayoutStudent/>}>
                    <Route index element={<StudentDashboard/>}/>
                    <Route path='courses' element={<StudentCourses/>}/>
                    <Route path='schedule' element={<StudentSchedule/>}/>
                    <Route path='score' element={<StudentScore/>}/>
                    <Route path='enrollment' element={<StudentEnrollment/>}/>
                    <Route path='notification' element={<StudentNotification/>}/>
                    <Route path="profile" element={<StudentProfile/>}/>
                    {/* Nested: student/course */}
                    <Route path="course">
                        <Route index element={<CourseHome/>}/>
                        <Route path="detail" element={<CourseDetailStudent/>}/>
                    </Route>
                </Route>

                {/* Course Route (ngoài student) */}
                <Route path='course'>
                    <Route path='home' element={<CourseHome/>}/>
                </Route>


                {/* Teacher Route */}
                <Route path='teacher' element={<LayoutTeacher/>}>
                    <Route index element={<TeacherDashboard/>}/>
                    <Route path='courses' element={<TeacherCourses/>}/>
                    <Route path='schedule' element={<TeacherSchedule/>}/>
                    <Route path='notification' element={<TeacherNotification/>}/>
                    <Route path="profile" element={<TeacherProfile/>}/>

                </Route>

                <Route element={<ProtectedRoute allowedRoles={['ACADEMIC_MANAGER']}/>}>
                    <Route path='staff' element={<LayoutAcademicManager/>}>
                        <Route index element={<AMDashboard/>}/>
                        <Route path='program' element={<AMProgram/>}/>
                        <Route path='courses' element={<AMCourse/>}/>
                        <Route path='teacher' element={<AMTeacher/>}/>
                        <Route path='student' element={<AMStudent/>}/>
                        <Route path='feedback' element={<AMFeedback/>}/>
                        <Route path='schedule' element={<AMSchedule/>}/>
                        <Route path='report' element={<AMReport/>}/>
                        <Route path='notification' element={<AMNotification/>}/>
                        <Route path='profile' element={<AMProfile/>}/>
                    </Route>
                </Route>

                {/* Admin Route */}
                <Route path='admin' element={<LayoutAdmin/>}>
                    <Route index element={<AdminDashboard/>}/>
                    <Route path='systems' element={<AdminSystems/>}/>
                    <Route path='upload' element={<AdminUpload/>}/>
                    <Route path='security' element={<AdminSecurity/>}/>
                    <Route path="profile" element={<AdminProfile/>}/>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;