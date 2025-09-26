import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import roleToRoute from '../app/router/roleToRoute.js';
import '../styles/LayoutNavbar.css';

export default function LayoutNavbar({ role, children }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true); // mặc định gọn
    const [hoverOpen, setHoverOpen] = useState(false);
    const mountedRef = useRef(false);

    const items = [
        { label: 'Tổng quan',
            icon: 'pi pi-home',
            roles: ['STUDENT','TEACHER','ACADEMIC_MANAGER','ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}`) },

        {
            label: 'Lớp học',
            icon:'pi pi-book',
            roles: ['STUDENT'],
            command: () => navigate(`/${roleToRoute(role)}/courses`) },

        { label: 'Lớp học & Khóa',
            icon: 'pi pi-book',
            roles: ['TEACHER','ACADEMIC_MANAGER'],
            items: [
                { label: 'Danh sách lớp ',
                    icon: 'pi pi-list',
                    roles: ['TEACHER','ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/courses`) },

                { label: 'Chương trình / Khóa học',
                    icon: 'pi pi-clone', roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/program`) }
            ]},

        { label: 'Quản lí học vụ',
            icon: 'pi pi-users',
            roles: ['ACADEMIC_MANAGER'],
            items: [
                { label: 'Danh sách học sinh',
                    icon: 'pi pi-list',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/studentlist`) },

                { label: 'Danh sách giáo viên',
                    icon: 'pi pi-id-card',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/teacherList`) },

                { label: 'Theo dõi & Feedback',
                    icon: 'pi pi-check-square',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/feedback`) },

                { label: 'Quản lý thời khóa biểu (tổng)',
                    icon: 'pi pi-table',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/schedule-overview`) }
            ]},

        { label: 'Thời khóa biểu',
            icon: 'pi pi-calendar',
            roles: ['STUDENT','TEACHER','ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/schedule`) },

        { label: 'Thông báo',
            icon: 'pi pi-bell',
            roles: ['STUDENT','TEACHER','ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/notification`) },

        { label: 'Thông tin cá nhân',
            icon: 'pi pi-user',
            roles: ['STUDENT','TEACHER','ACADEMIC_MANAGER','ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}/profile`) },

        { label: 'Quản trị hệ thống',
            icon: 'pi pi-cog',
            roles: ['ADMIN_IT'],
            items: [
                { label: 'Quản lý hệ thống',
                    icon: 'pi pi-server',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/systems') },

                { label: 'Quản lý dữ liệu (Upload)',
                    icon: 'pi pi-upload',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/upload') },

                { label: 'Quản lý bảo mật',
                    icon: 'pi pi-shield',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/security') },

                { label: 'Báo cáo & Xuất dữ liệu',
                    icon: 'pi pi-file',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/reports') },
                { label: 'Hồ sơ quản trị',
                    icon: 'pi pi-user-edit',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/profile') }
            ]}
    ];

    const filterByRole = (list, role) => {
        return list.map(item => {
            const newItem = { ...item };
            if (item.items) newItem.items = filterByRole(item.items, role);
            return newItem;
        }).filter(item => {
            const hasRole = Array.isArray(item.roles) ? item.roles.includes(role) : false;
            const hasVisibleChildren = Array.isArray(item.items) && item.items.length > 0;
            return hasRole || hasVisibleChildren;
        });
    };

    const visibleItems = filterByRole(items, role);

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        const isSmall = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
        setCollapsed(isSmall ? true : true);
    }, []);

    const isOpen = !collapsed || hoverOpen;

    const handleMouseEnter = () => {
        const isSmall = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
        if (collapsed && !isSmall) setHoverOpen(true);
    };
    const handleMouseLeave = () => { if (hoverOpen) setHoverOpen(false); };

    return (
        <div className="layout-navbar-wrapper">
            <aside
                className={`admin-sidebar ${isOpen ? '' : 'collapsed'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <PanelMenu model={visibleItems} multiple className="layout-panelmenu p-panelmenu" />
            </aside>
            <main className="layout-main" style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}

