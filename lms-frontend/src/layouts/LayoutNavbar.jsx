import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import roleToRoute from '../services/roleToRoute'
const LayoutNavbar = ({ role }) => {
    const navigate = useNavigate();
    const items = [
        {
            label: 'Tổng quan',
            icon: 'pi pi-home',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER', 'ADMIN_IT'],
            command: () => navigate(`/${roleToRoute(role)}`),
        },
        {
            label: 'Lớp học',
            icon: 'pi pi-book',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/courses`)
        },
        {
            label: 'Thời khóa biểu',
            icon: 'pi pi-calendar',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/schedule`)
        },

        {
            label: 'Thông báo',
            icon: 'pi pi-plus',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/notification`)
        },

        {
            label: 'Thông tin cá nhân',
            icon: 'pi pi-user',
            roles: ['STUDENT', 'TEACHER', 'ACADEMIC_MANAGER'],
            command: () => navigate(`/${roleToRoute(role)}/profile`)
        },
        //Eduacademic_manager Navbar Begin
        // {
        //     label: 'Quản lí chương trình đào tạo',
        //     icon: 'pi pi-book',
        //     // roles: ['academic_manager'],
        //     items: [
        //         {
        //             label: 'Môn học',
        //             icon: 'pi pi-bookmark',
        //             command: () => navigate('/admin/subjects'),
        //         },
        //         {
        //             label: 'Khóa học',
        //             icon: 'pi pi-clone',
        //             command: () => navigate('/admin/courses'),
        //         }
        //     ]
        // },
        // {
        //     label: 'Quản lí học viên',
        //     icon: 'pi pi-users',
        //     //roles: ['admin'],
        //     items: [
        //         {
        //             label: 'Danh sách học viên',
        //             icon: 'pi pi-list',
        //             command: () => navigate('/admin/students'),
        //         },
        //         {
        //             label: 'Điểm danh',
        //             icon: 'pi pi-calendar',
        //             command: () => navigate('/admin/attendance'),
        //         },
        //         {
        //             label: 'Bảng điểm',
        //             icon: 'pi pi-file',
        //             command: () => navigate('/admin/grades'),
        //         },
        //     ],
        // },
        // {
        //     label: 'Quản lí giáo viên',
        //     icon: 'pi pi-user-edit',
        //     items: [
        //         {
        //             label: 'Danh sách giáo viên',
        //             icon: 'pi pi-id-card',
        //             command: () => navigate('/admin/teachers'),
        //         },
        //         {
        //             label: 'Phân công giảng dạy',
        //             icon: 'pi pi-share-alt',
        //             command: () => navigate('/admin/teaching-assignments'),
        //         },
        //         {
        //             label: 'Quản lí yêu cầu',
        //             icon: 'pi pi-inbox',
        //             command: () => navigate('/admin/teacher-requests'),
        //         },
        //     ]
        // },
        // {
        //     label: 'Quản lí lớp học',
        //     icon: 'pi pi-briefcase',
        //     items: [
        //         {
        //             label: 'Danh sách lớp học',
        //             icon: 'pi pi-list',
        //             command: () => navigate('/admin/classes'),
        //         },
        //         {
        //             label: 'Xếp thời khóa biểu',
        //             icon: 'pi pi-table',
        //             command: () => navigate('/admin/schedule'),
        //         },
        //         {
        //             label: 'Điểm danh',
        //             icon: 'pi pi-calendar',
        //             command: () => navigate('/admin/class-attendance'),
        //         },
        //         {
        //             label: 'Nhập điểm',
        //             icon: 'pi pi-pencil',
        //             command: () => navigate('/admin/class-grades'),
        //         },
        //     ]
        // },
        // {
        //     label: 'Theo dõi và đánh giá',
        //     icon: 'pi pi-envelope',
        //     items: [
        //         {
        //             label: 'Feedback',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/eduacademic_manager/feedback'),
        //         }
        //     ]
        // },
        // {
        //     label: 'Lịch & Thông báo',
        //     icon: 'pi pi-envelope',
        //     items: [
        //         {
        //             label: 'Lịch khai giảng',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/schedule-startdates'),
        //         },
        //         {
        //             label: 'Lịch dạy tổng thể',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/schedule-overview'),
        //         },
        //     ]
        // },
        // {
        //     label: 'Xin nghỉ',
        //     icon: 'pi pi-envelope',
        //     items: [
        //         {
        //             label: 'Duyệt phép',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/leave-requests'),
        //         }
        //     ]
        // },
        // {
        //     label: 'Báo cáo & Xuất dữ liệu',
        //     icon: 'pi pi-envelope',
        //     items: [
        //         {
        //             label: 'Giảng viên',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/leave-requests')
        //         },
        //         {
        //             label: 'Khóa học',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/leave-requests')
        //         },
        //         {
        //             label: 'Học viên',
        //             icon: 'pi pi-check-square',
        //             command: () => navigate('/admin/leave-requests'),
        //         }
        //     ]
        // }
        //*Eduacademic_manager Navbar End*

        //*Admin Navbar Begin*
        {
            label: 'Quản lý hệ thống',
            icon: 'pi pi-bell',
            roles: ['ADMIN_IT'],
            command: () => navigate('/admin/systems'),
        },
        {
            label: 'Quản lý dữ liệu',
            icon: 'pi pi-bell',
            roles: ['ADMIN_IT'],
            command: () => navigate('/admin/upload'),
        },
        {
            label: 'Quản lý bảo mật',
            icon: 'pi pi-bell',
            roles: ['ADMIN_IT'],
            command: () => navigate('/admin/security'),
        }
        //*Admin Navbar End
    ];

    return (
        <PanelMenu
            model={items.filter(item => item.roles.includes(role))}
            multiple
            className="admin-sidebar"
        />

    );
}

export default LayoutNavbar;