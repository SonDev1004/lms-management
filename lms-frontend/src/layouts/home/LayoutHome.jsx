import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { MegaMenu } from 'primereact/megamenu';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axiosClient from 'services/axiosClient';
import roleToRoute from '../../services/roleToRoute';

import logo from 'assets/images/logo.png';

const LayoutHome = () => {
    // States, hooks and refs
    const role = localStorage.getItem('role');

    const navigate = useNavigate();
    const menuRight = useRef(null);

    // Functions
    const handleLogout = () => {
        axiosClient.post('auth/logout')
            .then(res => {
                localStorage.removeItem('username');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('role');
                navigate('/');
            });
    };

    // Menu items
    const items = [

        {
            label: 'Subjects',
            icon: 'pi pi-file',
            items: [
                [
                    {
                        label: 'Computer',
                        items: [{ label: 'Monitor' }, { label: 'Mouse' }, { label: 'Notebook' }, { label: 'Keyboard' }, { label: 'Printer' }, { label: 'Storage' }]
                    }
                ],
                [
                    {
                        label: 'Home Theather',
                        items: [{ label: 'Projector' }, { label: 'Speakers' }, { label: 'TVs' }]
                    }
                ],
                [
                    {
                        label: 'Gaming',
                        items: [{ label: 'Accessories' }, { label: 'Console' }, { label: 'PC' }, { label: 'Video Games' }]
                    }
                ],
                [
                    {
                        label: 'Appliances',
                        items: [{ label: 'Coffee Machine' }, { label: 'Fridge' }, { label: 'Oven' }, { label: 'Vaccum Cleaner' }, { label: 'Washing Machine' }]
                    }
                ]
            ]
        },

        //Phân quyền show Dashboard theo role
        ...(role && roleToRoute(role)
            ? [{
                label: 'Dashboard',
                icon: 'pi pi-clock',
                command: () => navigate(`/${roleToRoute(role)}`),
            }]
            : []
        ),
        //Tắt login khi đã đăng nhập
        ...(!localStorage.getItem('username')
            ? [{
                label: 'Login',
                icon: 'pi pi-sign-in',
                command: () => navigate('/login')
            }]
            : []
        )
    ];

    // Profile menu items
    const profileItems = [
        {
            label: `${localStorage.getItem('username')}`,
            items: [
                {
                    label: 'Tài khoản',
                    icon: 'pi pi-user'
                },
                {
                    label: 'Học trực tuyến',
                    icon: 'pi pi-book'
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            roles: ['student', 'teacher', 'academic_manager', 'admin'],
            command: handleLogout
        }
    ];

    // Menu start item
    const start = (
        <Link to='/' >
            <img alt="logo" src={logo} height="40" className="mr-2" />
        </Link >
    )

    // Menu end item
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            {
                localStorage.getItem('username') &&
                <>
                    <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" onClick={(e) => menuRight.current.toggle(e)} />
                    <Menu model={profileItems} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                </>
            }
        </div>
    );

    return (
        <>
            <MegaMenu model={items} start={start} end={end} />
            <Outlet />

        </>
    );
}

export default LayoutHome;