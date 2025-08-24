import { Navigate, Outlet } from "react-router-dom";
//Kiểm tra role có trong allowedRoles không,
// nếu có thì render Outlet, không thì chuyển hướng đến trang unauthorized
export default function ProtectedRoute({ allowedRoles }) {
    const userRole = localStorage.getItem("role");
    return allowedRoles.includes(userRole)
        ? <Outlet />
        : <Navigate to="/unauthorized" />;
}
