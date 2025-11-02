import LayoutNavbar from "../LayoutNavbar";
import LayoutHeader from '../LayoutHeader';
import { Outlet } from "react-router-dom";
import LayoutHomeFooter from "../home/LayoutHomeFooter";

const LayoutAdmin = () => {
    return (
        <>
            <LayoutHeader />
            <LayoutNavbar role="ADMIN_IT">
                <Outlet />
            </LayoutNavbar>
            <LayoutHomeFooter />
        </>
    );
}

export default LayoutAdmin;