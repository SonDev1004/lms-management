import LayoutNavbar from "../LayoutNavbar";
import LayoutHeader from '../LayoutHeader';
import { Outlet } from "react-router-dom";
import LayoutHomeFooter from "../home/LayoutHomeFooter";

const LayoutAdmin = () => {
    return (
        <>
            <LayoutHeader />
            <div className='grid'>
                <div className='col-3'>
                    <LayoutNavbar role='ADMIN_IT' />
                </div>
                <div className='col-9'>
                    <Outlet />
                </div>
            </div>
            <LayoutHomeFooter />

        </>
    );
}

export default LayoutAdmin;