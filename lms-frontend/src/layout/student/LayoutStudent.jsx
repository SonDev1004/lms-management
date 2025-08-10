// fe/admin/layout/LayoutAdmin.jsx
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { Outlet } from "react-router-dom";
import StudentSidebarMenu from '../student/StudentSidebarMenu.jsx';
import RightPanel from "../student/RightPanel.jsx";

const LayoutStudent = () => {
    return (
        <>
            <div>
                {/* Top menu */}
                <div className='grid shadow-1 mb-3 p-2'>
                    <div className='col-2'>Logo</div>

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

                {/* Sidebar + Content */}
                <div className='grid'>
                    <div className='col-2'>
                        <StudentSidebarMenu />
                    </div>

                    {/* Outlet sẽ render StudentDashboard / các page con */}
                    <div className="col-8">
                        <Outlet />
                    </div>

                    <div className="col-2">
                        <RightPanel />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LayoutStudent;
