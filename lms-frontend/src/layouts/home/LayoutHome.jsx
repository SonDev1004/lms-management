import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { MegaMenu } from 'primereact/megamenu';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import axiosClient from '@/shared/api/axiosClient.js';
import roleToRoute from '../../app/router/roleToRoute.js';

import logo from 'assets/images/logo.png';
import { AppConfig, AppUrls } from '@/shared/constants/index.js';
import LayoutHomeFooter from 'layouts/home/LayoutHomeFooter.jsx';

const LayoutHome = () => {
    // States, hooks and refs
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const menuRight = useRef(null);

    // Functions
    const handleLogout = () => {
        axiosClient.post(AppUrls.logout).then(() => {
            localStorage.removeItem('username');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            navigate('/');
        });
    };

    // Menu items
    const items = [
        { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },

        {
            label: 'Programs',
            icon: 'pi pi-book',
            command: () => navigate('/programs'),
        },

        {
            label: 'Subjects',
            icon: 'pi pi-graduation-cap',
            command: () => navigate('/subjects'),
        },

        { label: 'About us', icon: 'pi pi-info-circle', command: () => navigate('/about') },

        ...(role && roleToRoute(role)
            ? [{ label: 'Dashboard', icon: 'pi pi-th-large', command: () => navigate(`/${roleToRoute(role)}`) }]
            : [])
    ];

    // Profile menu items
    const profileItems = [
        {
            label: `${localStorage.getItem('username') || 'Account'}`,
            items: [
                {
                    label: 'Account',
                    icon: 'pi pi-user',
                    command: () => {
                        navigate('/userprofile');
                    }
                }
            ]
        },
        { separator: true },
        {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            roles: ['student', 'teacher', 'academic_manager', 'admin'],
            command: handleLogout
        }
    ];

    // Menu start item
    const start = (
        <Link to="/">
            <img alt="logo" src={logo} height="40" className="mr-2" />
        </Link>
    );

    // Menu end item
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-10rem sm:w-14rem" />
            {!localStorage.getItem('username') ? (
                <>
                    <Button
                        label="Log in"
                        icon="pi pi-sign-in"
                        outlined
                        size="small"
                        onClick={() => navigate('/login')}
                    />
                    <Button
                        label="Register"
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
};

export default LayoutHome;
