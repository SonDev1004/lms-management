import LayoutNavbar from "../LayoutNavbar";
import LayoutHeader from '../LayoutHeader';
import { Outlet } from "react-router-dom";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";

const LayoutTeacher = () => {
    return (
        <>
            <LayoutHeader />
            <LayoutNavbar role="TEACHER">
                <Outlet />
            </LayoutNavbar>
            <LayoutHomeFooter />
        </>
    );
}

export default LayoutTeacher;