import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutHome from 'layouts/home/LayoutHome';
import Login from 'pages/home/Login';
import Register from 'pages/home/Register';
import LayoutStudent from 'layouts/student/LayoutStudent';
import CourseHome from 'pages/course/CourseHome.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home Route */}
                <Route path='/' element={<LayoutHome />} >
                    <Route index element={<div>Welcome to the LMS</div>} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route>

                {/* Student Route */}
                <Route path='student' element={<LayoutStudent />}>

                </Route>

                <Route path='course'>
                    <Route path='home' element={<CourseHome />} />
                </Route>

                {/* Teacher Route */}
                <Route path='teacher'>

                </Route>

                {/* Staff Route */}
                <Route path='staff'>

                </Route>

                {/* Admin Route */}
                <Route path='admin'>

                </Route>

            </Routes>
        </BrowserRouter >
    );
}

export default App;