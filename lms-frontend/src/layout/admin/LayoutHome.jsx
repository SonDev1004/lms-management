import { useRef } from "react";

import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Panel } from 'primereact/panel';

import './LayoutHome.css';
import axios from "axios";

const LayoutHome = () => {
    const menuRight = useRef(null);
    const navigate = useNavigate();

    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    const handleLogout = () => {
        axios.post('http://14.225.198.117:8081/api/auth/logout')
            .then(res => {
                localStorage.removeItem('username');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/home');
            });
    }

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home'
        },
        {
            label: 'Features',
            icon: 'pi pi-star'
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Core',
                    icon: 'pi pi-bolt',
                    shortcut: '⌘+S',
                    template: itemRenderer
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server',
                    shortcut: '⌘+B',
                    template: itemRenderer
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil',
                    shortcut: '⌘+U',
                    template: itemRenderer
                },
                {
                    separator: true
                },
                {
                    label: 'Templates',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Apollo',
                            icon: 'pi pi-palette',
                            badge: 2,
                            template: itemRenderer
                        },
                        {
                            label: 'Ultima',
                            icon: 'pi pi-palette',
                            badge: 3,
                            template: itemRenderer
                        }
                    ]
                }
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            badge: 3,
            template: itemRenderer
        }
    ];

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
            command: handleLogout
        }
    ];

    //Menubar Begin
    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
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
    //Menubar End

    //Footer Begin

    /*const [visible, setVisible] = useState(false);
    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );*/

    //Footer End

    return (
        <>
            <Menubar model={items} start={start} end={end} />
            <Outlet />

            <div className='grid py-6 ' style={{ backgroundColor: 'gray' }}>
                <div className="col-6">
                    <Panel header='Thông tin liên hệ'>
                        <div className="mb-3">
                            <i className="pi pi-facebook"></i> <a href="http://www.facebook.com">http://www.facebook.com</a>
                        </div>
                        <div className="mb-3">
                            <i className="pi pi-phone"></i> <a href="tel:0901234567">0901234567</a>
                        </div>
                        <div className="mb-3">
                            <i className="pi pi-map-marker"></i> <span>123 Nguyen Thi Minh Khai</span>
                        </div>
                    </Panel>
                </div>

                <div className="col-6">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" alt="" className="w-full" />
                </div>
            </div>
        </>);
}

export default LayoutHome;