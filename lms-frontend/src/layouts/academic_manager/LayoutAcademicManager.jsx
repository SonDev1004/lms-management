import LayoutNavbar from "../LayoutNavbar";
import LayoutHeader from '../LayoutHeader';
import { Outlet } from "react-router-dom";
import LayoutHomeFooter from "../home/LayoutHomeFooter";

const LayoutAcademicManager = () => {
    return (
        <>
            <LayoutHeader />
            <LayoutNavbar role="ACADEMIC_MANAGER">
                <Outlet />
            </LayoutNavbar>
            <LayoutHomeFooter />
        </>
    );
};

export default LayoutAcademicManager;
