import LayoutNavbar from "../LayoutNavbar";
import LayoutHeader from '../LayoutHeader';
import { Outlet } from "react-router-dom";
import LayoutHomeFooter from "../home/LayoutHomeFooter";

const LayoutAcademicManager = () => {
    return (<>
        <LayoutHeader />
        <div className='grid'>
            <div className='col-3'>
                <LayoutNavbar role='academic_manager' />
            </div>
            <div className='col-9'>
                <Outlet />
            </div>
        </div>
        <LayoutHomeFooter />
    </>);
}

export default LayoutAcademicManager;