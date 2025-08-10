import { PanelMenu } from 'primereact/panelmenu';
import { useNavigate } from 'react-router-dom';

const StudentSidebarMenu = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Trang chủ',
            icon: 'pi pi-home',
            command: () => navigate('/student')
        },
        {
            label: 'Thông báo',
            icon: 'pi pi-bell',
            command: () => navigate('/student/notifications')
        },
        {
            label: 'Khóa học của tôi',
            icon: 'pi pi-book',
            command: () => navigate('/student/courses')
        },
        {
            label: 'Thời khóa biểu',
            icon: 'pi pi-calendar',
            command: () => navigate('/student/timetable')
        },
        {
            label: 'Bài tập',
            icon: 'pi pi-pencil',
            command: () => navigate('/student/assignments')
        },
        {
            label: 'Điểm danh',
            icon: 'pi pi-check-square',
            command: () => navigate('/student/attendance')
        },
        {
            label: 'Điểm số',
            icon: 'pi pi-chart-line',
            command: () => navigate('/student/grades')
        }
    ];

    return (
        <PanelMenu
            model={items}
            className="student-sidebar"
        />
    );
};

export default StudentSidebarMenu;
