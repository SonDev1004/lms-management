import LayoutNavbar from '../LayoutNavbar';
import LayoutHeader from '../LayoutHeader';
import { Outlet } from 'react-router-dom';
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";

const LayoutStudent = () => {
    return (
        <>
            <LayoutHeader />
            <LayoutNavbar role="STUDENT">
                <Outlet />
            </LayoutNavbar>
            <LayoutHomeFooter />
        </>
    );
}

export default LayoutStudent;