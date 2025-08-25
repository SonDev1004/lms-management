import { Navigate, Outlet } from "react-router-dom";
//Kiểm tra role có trong allowedRoles không,
// nếu có thì render Outlet, không thì chuyển hướng đến trang unauthorized
export default function ProtectedRoute({ allowedRoles }) {
    const userRole = localStorage.getItem("role");
    //Chuyển sang login nếu chưa đăng nhập đúng quyền thi
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }
    // Nếu không đúng quyền, chuyển về /unauthorized
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Đúng quyền thì render trang
    return <Outlet />;

}
