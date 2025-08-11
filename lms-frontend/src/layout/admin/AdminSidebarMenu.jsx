import { PanelMenu } from 'primereact/panelmenu';
import { useNavigate } from 'react-router-dom';

const AdminSidebarMenu = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Quản lí đào tạo',
            icon: 'pi pi-book',
            items: [
                {
                    label: 'Môn học',
                    icon: 'pi pi-bookmark',
                    command: () => navigate('/admin/subjects'),
                },
                {
                    label: 'Khóa học',
                    icon: 'pi pi-clone',
                    command: () => navigate('/admin/courses'),
                }
            ]
        },

        {
            label: 'Quản lí học viên',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Danh sách học viên',
                    icon: 'pi pi-list',
                    command: () => navigate('/admin/students'),
                },
                {
                    label: 'Điểm danh',
                    icon: 'pi pi-calendar',
                    command: () => navigate('/admin/attendance'),
                },
                {
                    label: 'Bảng điểm',
                    icon: 'pi pi-file',
                    command: () => navigate('/admin/grades'),
                },
            ],
        },

        {
            label: 'Quản lí giáo viên',
            icon: 'pi pi-user-edit',
            items: [
                {
                    label: 'Danh sách giáo viên',
                    icon: 'pi pi-id-card',
                    command: () => navigate('/admin/teachers'),
                },
                {
                    label: 'Phân công giảng dạy',
                    icon: 'pi pi-share-alt',
                    command: () => navigate('/admin/teaching-assignments'),
                },
                {
                    label: 'Quản lí yêu cầu',
                    icon: 'pi pi-inbox',
                    command: () => navigate('/admin/teacher-requests'),
                },
            ]
        },

        {
            label: 'Quản lí lớp học',
            icon: 'pi pi-briefcase',
            items: [
                {
                    label: 'Danh sách lớp học',
                    icon: 'pi pi-list',
                    command: () => navigate('/admin/classes'),
                },
                {
                    label: 'Xếp thời khóa biểu',
                    icon: 'pi pi-table',
                    command: () => navigate('/admin/schedule'),
                },
                {
                    label: 'Điểm danh',
                    icon: 'pi pi-calendar',
                    command: () => navigate('/admin/class-attendance'),
                },
                {
                    label: 'Nhập điểm',
                    icon: 'pi pi-pencil',
                    command: () => navigate('/admin/class-grades'),
                },
            ]
        },

        {
            label: 'Xin nghỉ',
            icon: 'pi pi-envelope',
            items: [
                {
                    label: 'Duyệt phép',
                    icon: 'pi pi-check-square',
                    command: () => navigate('/admin/leave-requests'),
                }
            ]
        },

        {
            label: 'Đánh giá',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'Học sinh',
                    icon: 'pi pi-user',
                    command: () => navigate('/admin/reviews/student'),
                },
                {
                    label: 'Giáo viên',
                    icon: 'pi pi-user-edit',
                    command: () => navigate('/admin/reviews/teacher'),
                },
                {
                    label: 'Phòng đào tạo',
                    icon: 'pi pi-building',
                    command: () => navigate('/admin/reviews/edu'),
                }
            ]
        },

        {
            label: 'Thông báo',
            icon: 'pi pi-bell',
            command: () => navigate('/admin/notifications'),
        }
    ];

    return (
        <PanelMenu
            model={items}
            multiple
            className="admin-sidebar"
        />
    );
};

export default AdminSidebarMenu;
