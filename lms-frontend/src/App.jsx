import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import LayoutAdmin from './layout/admin/LayoutAdmin';
import SubjectManagement from './pages/admin/SubjectManagement';
import AuthTabs from './layout/AuthTabs.jsx';
import './layout/AuthTabs.css';
import LayoutStudent from "./layout/student/LayoutStudent.jsx";
import StudentDashboard from './layout/student/StudentDashboard.jsx';

function AppRoutes() {
    const navigate = useNavigate();

    // handleLogin được đặt ở đây để có thể dùng useNavigate
    const handleLogin = async ({ username, password, remember }) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'admin' && password === '123') {
                    if (remember) {
                        localStorage.setItem('rememberUsername', username.trim());
                    } else {
                        localStorage.removeItem('rememberUsername');
                    }
                    navigate('/admin', { replace: true });
                    resolve({ success: true });

                } else if (username === 'student' && password === '123') {
                    if (remember) {
                        localStorage.setItem('rememberUsername', username.trim());
                    } else {
                        localStorage.removeItem('rememberUsername');
                    }
                    navigate('/student', { replace: true });
                    resolve({ success: true });

                } else {
                    reject(new Error('Sai username hoặc password'));
                }

            }, 500);
        });
    };

    return (
        <Routes>
            {/* Redirect root to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth routes: pass handleLogin down to AuthTabs */}
            <Route path="/login" element={<AuthTabs onLogin={handleLogin} />} />
            <Route path="/register" element={<AuthTabs onLogin={handleLogin} />} />

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
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
