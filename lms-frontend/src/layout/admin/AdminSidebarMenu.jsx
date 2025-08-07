import { PanelMenu } from 'primereact/panelmenu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebarMenu = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Đào tạo',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'Môn học',
                    icon: 'pi pi-file',
                    command: () => navigate('/admin/subjects')
                },
                {
                    label: 'Images',
                    icon: 'pi pi-image',
                    items: [
                        {
                            label: 'Logos',
                            icon: 'pi pi-image'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Cloud',
            icon: 'pi pi-cloud',
            items: [
                {
                    label: 'Upload',
                    icon: 'pi pi-cloud-upload'
                },
                {
                    label: 'Download',
                    icon: 'pi pi-cloud-download'
                },
                {
                    label: 'Sync',
                    icon: 'pi pi-refresh'
                }
            ]
        },
        {
            label: 'Devices',
            icon: 'pi pi-desktop',
            items: [
                {
                    label: 'Phone',
                    icon: 'pi pi-mobile'
                },
                {
                    label: 'Desktop',
                    icon: 'pi pi-desktop'
                },
                {
                    label: 'Tablet',
                    icon: 'pi pi-tablet'
                }
            ]
        }
    ];

    return (
        <>
            <PanelMenu model={items} multiple />
        </>
    );
}

export default AdminSidebarMenu;