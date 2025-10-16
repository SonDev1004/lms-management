
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Menu } from 'primereact/menu';
import logo from 'assets/images/logo.png';
import axiosClient from '@/shared/api/axiosClient.js';
import { AppUrls } from "@/shared/constants/index.js";

export default function TemplateDemo() {
    const navigate = useNavigate();
    const menuRight = useRef(null);
    // Functions
    const handleLogout = () => {
        axiosClient.post(AppUrls.logout)
            .then(res => {
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/');
            });
    };

    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            roles: ['admin'],
            command: () => navigate('/')
        }
    ];

    // Profile menu items
    const profileItems = [
        {
            label: `${localStorage.getItem('username')}`,
            items: [
                {
                    label: 'Account',
                    icon: 'pi pi-user'
                },
                {
                    label: 'Online Learning',
                    icon: 'pi pi-book'
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: handleLogout
        }
    ];

    // Menu start item
    const start = <Link to='/'><img alt="logo" src={logo} height="40" className="mr-2" /></Link>

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
        <div className="card">
            <Menubar model={items} start={start} end={end} />
        </div>
    )
}
