import LayoutNavbar from '../LayoutNavbar';
import LayoutHeader from '../LayoutHeader';
import { Outlet } from 'react-router-dom';

const LayoutStudent = () => {
    return (
        <>
            <LayoutHeader />
            <div className='grid'>
                <div className='col-3'>
                    <LayoutNavbar role='student' />
                </div>
                <div className='col-9'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default LayoutStudent;