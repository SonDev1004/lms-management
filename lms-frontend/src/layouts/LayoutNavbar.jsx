import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PanelMenu} from 'primereact/panelmenu';
import roleToRoute from '../app/router/roleToRoute.js';
import '../styles/LayoutNavbar.css';

export default function LayoutNavbar({role, children}) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const [hoverOpen, setHoverOpen] = useState(false);
    const mountedRef = useRef(false);

    const items = [
        {
            label: 'Overview',
            icon: 'pi pi-home',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER', 'ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}`)
        },

        {
            label: 'Courses',
            icon: 'pi pi-book',
            roles: ['STUDENT'],
            command: () => navigate(`/${roleToRoute(role)}/courses`)
        },

        {
            label: 'Courses & Programs',
            icon: 'pi pi-book',
            roles: ['TEACHER', 'ACADEMIC_MANAGER'],
            items: [
                {
                    label: 'Class list',
                    icon: 'pi pi-list',
                    roles: ['TEACHER', 'ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/courses`)
                },
                {
                    label: 'Programs / Subjects',
                    icon: 'pi pi-clone',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/program`)
                }
            ]
        },

        {
            label: 'Academic Management',
            icon: 'pi pi-users',
            roles: ['ACADEMIC_MANAGER'],
            items: [
                {
                    label: 'Student list',
                    icon: 'pi pi-list',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/student-manager`)
                },
                {
                    label: 'Teacher list',
                    icon: 'pi pi-id-card',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/teacher-list`)
                },
                {
                    label: 'Monitoring & Feedback',
                    icon: 'pi pi-check-square',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/feedback`)
                },
                {
                    label: 'Master Timetable',
                    icon: 'pi pi-table',
                    roles: ['ACADEMIC_MANAGER'],
                    command: () => navigate(`/${roleToRoute(role)}/schedule-overview`)
                }
            ]
        },

        {
            label: 'Schedule',
            icon: 'pi pi-calendar',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/schedule`)
        },

        {
            label: 'Notifications',
            icon: 'pi pi-bell',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER', 'ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}/notification`)
        },

        {
            label: 'Attendance',
            icon: 'pi pi-check-square',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/attendance`)
        },
        {
            label: 'Assginments',
            icon: 'pi pi-briefcase',
            roles: ['TEACHER'],
            command: () => navigate(`/${roleToRoute(role)}/assignments`)
        },

        {
            label: 'System Administration',
            icon: 'pi pi-cog',
            roles: ['ADMIN_IT'],
            items: [
                {
                    label: 'System Management',
                    icon: 'pi pi-server',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/systems')
                },
                {
                    label: 'Data Management (Upload)',
                    icon: 'pi pi-upload',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/upload')
                },
                {
                    label: 'Tuition Revenue',
                    icon: 'pi pi-chart-line',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/tuitionrevenue')
                },
                {
                    label: 'New Enrollment', // <- THÊM dấu { mở phần tử
                    icon: 'pi pi-user-plus',
                    roles: ['ADMIN_IT'],
                    command: () => navigate('/admin/new-enrollment')
                }
            ]
        },

        {
            label: 'Profile',
            icon: 'pi pi-user',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER', 'ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}/profile`)
        }
    ];

    const filterByRole = (list, role) =>
        list
            .map((item) => {
                const newItem = {...item};
                if (item.items) newItem.items = filterByRole(item.items, role);
                return newItem;
            })
            .filter((item) => {
                const hasRole = Array.isArray(item.roles) ? item.roles.includes(role) : false;
                const hasVisibleChildren = Array.isArray(item.items) && item.items.length > 0;
                return hasRole || hasVisibleChildren;
            });

    const visibleItems = useMemo(() => filterByRole(items, role), [items, role]);

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        const isSmall =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(max-width: 767px)').matches;
        setCollapsed(isSmall);
    }, []);

    const isOpen = !collapsed || hoverOpen;

    const handleMouseEnter = () => {
        const isSmall =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(max-width: 767px)').matches;
        if (collapsed && !isSmall) setHoverOpen(true);
    };

    const handleMouseLeave = () => {
        if (hoverOpen) setHoverOpen(false);
    };

    return (
        <div className="layout-navbar-wrapper">
            <aside
                className={`admin-sidebar ${isOpen ? '' : 'collapsed'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <PanelMenu model={visibleItems} multiple className="layout-panelmenu p-panelmenu"/>
            </aside>
            <main className="layout-main" style={{flex: 1}}>
                {children}
            </main>
        </div>
    );
}
