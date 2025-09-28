import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from '@/features/auth/pages/Login.jsx';
import Register from '@/features/auth/pages/Register.jsx';
import Guest from './features/home/pages/Guest.jsx';

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
import AMFeedback from '@/features/academic_manager/pages/AMFeedback.jsx';
import AMSchedule from '@/features/academic_manager/pages/AMSchedule.jsx';
import AMReport from '@/features/academic_manager/pages/AMReport.jsx';
import AMNotification from '@/features/academic_manager/pages/AMNotification.jsx';
import ProgramDetail from './features/program/pages/ProgramDetail.jsx';


import CourseHome from '@/features/course/pages/CourseHome.jsx';
import CourseDetailStudent from '@/features/course/pages/CourseDetailStudent.jsx';
import StudentNotification from '@/features/student/pages/StudentNotification.jsx';
import StudentProfile from '@/features/student/pages/StudentProfile.jsx';
import ProtectedRoute from '@/app/router/ProtectedRoute.jsx';
import AMProfile from '@/features/academic_manager/pages/AMProfile.jsx';
import TeacherProfile from '@/features/teacher/pages/TeacherProfile.jsx';
import AdminProfile from '@/features/admin/pages/AdminProfile.jsx';
import Unauthorized from '@/features/auth/pages/Unauthorized.jsx';
import FAQ from '@/features/home/pages/FAQ.jsx';
import Blog from '@/features/home/pages/Blog.jsx';
import About from '@/features/home/pages/About.jsx';
import SubjectDetail from '@/features/subject/pages/SubjectDetail.jsx';
import ProgramList from '@/features/program/pages/ProgramList.jsx';
import SubjectList from '@/features/subject/pages/SubjectList.jsx';
import AttendancePanel from './features/teacher/components/AttendancePanel.jsx';
import AttendanceSummary from './features/teacher/components/AttendanceSummary.jsx';
import CourseDetailTeacher from './features/course/pages/CourseDetailTeacher.jsx';
import PaymentForm from "@/features/payment/PaymentForm.jsx";
import PaymentSuccess from "@/features/payment/PaymentSuccess.jsx";
import PaymentFailed from "@/features/payment/PaymentFailed.jsx";
import PaymentCancelled from "@/features/payment/PaymentCancelled.jsx";
import SessionList from './features/session/components/SessionList.jsx';
import StudentManagement from '@/features/academic_manager/list/student/pages/StudentManagement.jsx';
import MStudentProfile from "@/features/academic_manager/profile/student/pages/StudentProfile.jsx";
import TeacherManagement from "@/features/academic_manager/list/teacher/pages/TeacherManagement.jsx";
import AMTeacherProfile from "@/features/academic_manager/pages/AMTeacherProfile.jsx";
import AMCourseDetail from "@/features/academic_manager/pages/AMCourseDetail.jsx";
import AMProgramDetail from "@/features/academic_manager/pages/AMProgramDetail.jsx";

const App = () => {

	return (
		<BrowserRouter>
			<Routes>
				{/* Home Route */}
				<Route path="/" element={<LayoutHome />}>
					<Route index element={<Guest />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="about" element={<About />} />
					<Route path="faq" element={<FAQ />} />
					<Route path="blog" element={<Blog />} />
					<Route path="programs" element={<ProgramList />} />
					<Route path="subjects" element={<SubjectList />} />
					<Route path="payment" element={<PaymentForm />} />
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
						<Route
							path='courses/:slug'
							element={<CourseDetailStudent />}
						/>
						<Route path='schedule' element={<StudentSchedule />} />
						<Route path='score' element={<StudentScore />} />
						<Route
							path='enrollment'
							element={<StudentEnrollment />}
						/>
						<Route
							path='notification'
							element={<StudentNotification />}
						/>
						<Route path='profile' element={<StudentProfile />} />
					</Route>
				</Route>

				{/* Teacher Route */}
				<Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
					<Route path='teacher' element={<LayoutTeacher />}>
						<Route index element={<TeacherDashboard />} />
						<Route path='courses' element={<TeacherCourses />} />
						<Route path='courses/:courseId' element={<CourseDetailTeacher />} >
							<Route index element={<SessionList />} />
							<Route
								path='student-list'
								element={<StudentList />}
							/>
							<Route path='attendance'>
								<Route index element={<AttendancePanel />} />
								<Route
									path='full'
									element={<AttendanceSummary />}
								/>
							</Route>
						</Route>

						<Route path='schedule' element={<TeacherSchedule />} />
						<Route
							path='notification'
							element={<TeacherNotification />}
						/>
						<Route path='profile' element={<TeacherProfile />} />
					</Route>
				</Route>

				<Route
					element={
						<ProtectedRoute allowedRoles={['ACADEMIC_MANAGER']} />
					}
				>
					<Route path='staff' element={<LayoutAcademicManager />}>
						<Route index element={<AMDashboard   />} />
						<Route path='student-manager' element={<StudentManagement />} />
						<Route path="student-manager/:id" element={<MStudentProfile />} />
						<Route path='teacher-list' element={<TeacherManagement />} />
						<Route path='teacher-list/:id' element={<AMTeacherProfile/>} />
						<Route path='program' element={<AMProgram />} />
						<Route path='detail/:id' element={<AMProgramDetail />} />
						<Route path='courses' element={<AMCourse />}>
							<Route path='detail/:id' element={<AMCourseDetail />} />
						</Route>
						<Route path='teacher' element={<AMTeacher />} />
						<Route path='student' element={<AMStudent />} />
						<Route path='feedback' element={<AMFeedback />} />
						<Route path='schedule' element={<AMSchedule />} />
						<Route path='report' element={<AMReport />} />
						<Route
							path='notification'
							element={<AMNotification />}
						/>
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
					</Route>
				</Route>
				<Route path='/unauthorized' element={<Unauthorized />} />
			</Routes>
		</BrowserRouter>
	);

};

export default App;
