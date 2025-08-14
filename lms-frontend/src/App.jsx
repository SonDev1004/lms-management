import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import LayoutAdmin from './layout/admin/LayoutAdmin';

import SubjectManagement from './pages/admin/SubjectManagement';
import AuthTabs from './pages/AuthTabs.jsx';

import LayoutStudent from "./layout/student/LayoutStudent.jsx";
import StudentDashboard from './layout/student/StudentDashboard.jsx';

import LayoutHome from './layout/LayoutHome';
import Home from './pages/Home';

import axios from 'axios';
import CourseDetail from './pages/CourseDetail.jsx';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axios.defaults.baseURL = 'http://14.225.198.117:8081/api/';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/'>
                        <Route path='home' element={<LayoutHome />}>
                            <Route index element={<Home />} />
                            <Route path='login' element={<AuthTabs />} />
                        </Route>

                        {/*Course */}
                        <Route path='course' element={<LayoutHome />}>
                            <Route path='detail' element={<CourseDetail />} />
                        </Route>

                        {/* Student */}
                        <Route path="student" element={<LayoutStudent />}>
                            <Route index element={<StudentDashboard />} />
                            {/* Các route student khác */}
                        </Route>

                        {/* Teacher */}
                        <Route path="teacher">
                            {/* Các route teacher */}
                        </Route>

                        {/* Admin routes */}
                        <Route path="admin" element={<LayoutAdmin />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="subjects" element={<SubjectManagement />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
