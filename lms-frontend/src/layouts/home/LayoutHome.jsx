import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { MegaMenu } from 'primereact/megamenu';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient.js';
import roleToRoute from '../../app/router/roleToRoute.js';

import logo from 'assets/images/logo.png';
import {AppConfig, AppUrls} from "@/shared/constants/index.js";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";
import {Button} from "primereact/button";

const LayoutHome = () => {
    // States, hooks and refs
    const role = localStorage.getItem('role');

    const navigate = useNavigate();
    const menuRight = useRef(null);

    // Functions
    const handleLogout = () => {
        axiosClient.post(AppUrls.logout)
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
        { label: 'Trang chủ', icon: 'pi pi-home', command: () => navigate('/') },

        {
            label: 'Chương trình',
            icon: 'pi pi-book',
            command: () => navigate('/programs'),
            items: [
                [
                    { label: 'Frontend Cơ Bản', items: [
                            { label: 'Lộ trình', command: () => navigate('/program/1') },
                            { label: 'Học phí' }
                        ] }
                ],
                [
                    { label: 'IELTS 5.0+', items: [
                            { label: 'Tổng quan', command: () => navigate('/program/2') },
                            { label: 'Lịch khai giảng' }
                        ] }
                ],
                [
                    { label: 'Data Fundamentals', items: [
                            { label: 'Giới thiệu', command: () => navigate('/program/3') }
                        ] }
                ]
            ]
        },

        {
            label: 'Môn học',
            icon: 'pi pi-graduation-cap',
            items: [
                [
                    { label: 'Kỹ năng', items: [
                            { label: 'Listening Skills', command: () => navigate('/subject/12') },
                            { label: 'Speaking Skills', command: () => navigate('/subject/13') },
                            { label: 'Reading Skills', command: () => navigate('/subject/14') }
                        ] }
                ],
                [
                    { label: 'Nền tảng', items: [
                            { label: 'Grammar Foundation', command: () => navigate('/subject/11') }
                        ] }
                ]
            ]
        },

        { label: 'Về chúng tôi', icon: 'pi pi-info-circle', command: () => navigate('/about') },
        { label: 'FAQ', icon: 'pi pi-question-circle', command: () => navigate('/faq') },
        { label: 'Blog', icon: 'pi pi-file-edit', command: () => navigate('/blog') },

        ...(role && roleToRoute(role)
            ? [{ label: 'Dashboard', icon: 'pi pi-th-large', command: () => navigate(`/${roleToRoute(role)}`) }]
            : [])
    ];

    // Profile menu items
    const profileItems = [
        {
            label: `${localStorage.getItem('username')}`,
            items: [
                {
                    label: 'Tài khoản',
                    icon: 'pi pi-user',
                    command: () => {
                        navigate('/user-profile');
                    }
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
            <InputText placeholder="Search" type="text" className="w-10rem sm:w-14rem" />
            { !localStorage.getItem('username') ? (
                <>
                    <Button
                        label="Đăng nhập"
                        icon="pi pi-sign-in"
                        outlined
                        size="small"
                        onClick={() => navigate('/login')}
                    />
                    <Button
                        label="Đăng ký"
                        icon="pi pi-user-plus"
                        size="small"
                        onClick={() => navigate('/register')}
                    />
                </>
            ) : (
                <>
                    <Avatar
                        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                        shape="circle"
                        onClick={(e) => menuRight.current.toggle(e)}
                        className="cursor-pointer"
                    />
                    <Menu
                        model={profileItems}
                        popup
                        ref={menuRight}
                        id="popup_menu_right"
                        popupAlignment="right"
                    />
                </>
            )}
        </div>
    );


    return (
        <div className="min-h-screen flex flex-column">
            <div className="surface-0 shadow-2">
                <MegaMenu model={items} start={start} end={end} />
            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutHome;