import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import LayoutAdmin from './layout/admin/LayoutAdmin';
import SubjectManagement from './pages/admin/SubjectManagement';
import AuthTabs from './layout/AuthTabs.jsx';
import './layout/AuthTabs.css';
import LayoutStudent from "./layout/student/LayoutStudent.jsx";
import StudentDashboard from './layout/student/StudentDashboard.jsx';

import LayoutHome from './layout/admin/LayoutHome';
import Home from './pages/Home';
import axios from 'axios';

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
