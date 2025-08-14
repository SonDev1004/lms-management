import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Link, Outlet } from "react-router-dom";
import AdminSidebarMenu from './AdminSidebarMenu';
import StudentSidebarMenu from "../student/StudentSidebarMenu.jsx";
import RightPanel from "../student/RightPanel.jsx";

const LayoutAdmin = () => {
    return (
        <>
            <div>
                {/* Top menu */}
                <div className='grid shadow-1 mb-3'>
                    <Link to="/home" style={{ display: 'inline-block' }}>
                        <img
                            alt="logo"
                            src="https://primefaces.org/cdn/primereact/images/logo.png"
                            height="40"
                            className="mr-2"
                        />
                    </Link>

                    <div className='col-10'>
                        <div className='grid'>
                            <div className='col-6'>
                                <div className='p-inputgroup flex-1'>
                                    <InputText placeholder='Keyword' />
                                    <Button icon='pi pi-search' className='p-button-primary' />
                                </div>
                            </div>
                            <div className='col-6 flex justify-content-end gap-2'>
                                <Button icon='pi pi-bell' rounded severity='primary' aria-label='Notification'>
                                    <Badge value='4' severity='danger' />
                                </Button>
                                <Avatar icon="pi pi-user" size='large' shape='circle' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar menu */}
                <div className='grid'>
                    <div className='col-2'>
                        <AdminSidebarMenu />
                    </div>

                    <div className='col-10'>
                        <Outlet />
                    </div>
                </div>


            </div>
        </>
    );
}

export default LayoutAdmin;