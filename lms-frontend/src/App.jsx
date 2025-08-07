import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import LayoutAdmin from './layout/admin/LayoutAdmin';
import SubjectManagement from './pages/admin/SubjectManagement';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'>

            <Route path='student'></Route>

            <Route path='teacher'></Route>

            <Route path='admin' element={<LayoutAdmin />}>
              <Route index element={<AdminDashboard />} />
              <Route path='subjects' element={<SubjectManagement />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;