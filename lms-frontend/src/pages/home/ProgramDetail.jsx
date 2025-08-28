
import { useParams, useNavigate } from "react-router-dom";
import { programsDetail } from "../../services/mockProgramsDetail.js";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import dateFormat from "dateformat";
import { useEffect } from "react";

import { courses } from "../../services/mockCourses.js";
import { teachers } from "../../services/mockTeachers.js";
import { users } from "../../services/mockUsers.js";
import { Panel } from "primereact/panel";

const ProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const footer = (
        <>
            <div className="flex justify-content-center">
                <Button label="Đăng ký" icon="pi pi-check" />
                <Button label="Quay lại trang chủ"
                    severity="info" icon="pi pi-times"
                    style={{ marginLeft: '0.5em' }}
                    onClick={() => navigate(`/`)} />
            </div>
        </>
    );

    //Ép kiểu id từ chuỗi sang số nguyên nếu không có id thì trả về thẻ div ko tìm thấy ctrinh
    const program = programsDetail.find(p => p.id === parseInt(id));
    if (!program) return <div>Không tìm thấy chương trình.</div>;

    //CourseList trong ProgramDetail
    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return "Chưa có giáo viên";

        const user = users.find(u => u.id === teacher.user_id);
        return user ? `${user.first_name} ${user.last_name}` : "Chưa có giáo viên";
    };

    //Trạng thái khóa học
    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <span className="badge badge-open">Đang mở</span>;
            case 0: return <span className="badge badge-closed">Đang đóng</span>;
            case 2: return <span className="badge badge-upcoming">Sắp mở</span>;
            default: return null;
        }
    };

    //Lọc courses cho program hiện tại
    const programCourses = courses.filter(c => c.program_id === program.id);

    return (
        <>
            <Card className="mt-2">
                <img className=" landscape-image" src="https://www.dexerto.com/cdn-image/wp-content/uploads/2024/12/04/HSR-new-banner-1.jpg" />
                <div className="grid align-items-center mb-3" >
                    <div className="col-4">
                        <h2>{program.title}</h2>
                    </div>
                    <div className="col-4">
                        <h2>{program.fee}</h2>
                    </div>
                    <div className="col-4">
                        {program.is_active === 1 ? (
                            <h2 className="badge badge-open">Đang mở</h2>
                        ) : program.is_active === 0 ? (
                            <h2 className="badge badge-closed">Đang đóng</h2>
                        ) : program.is_active === 2 ? (
                            <h2 className="badge badge-upcoming">Sắp mở</h2>
                        ) : null}
                    </div>
                    <Divider />
                    <div className="border-bottom">
                        <div>{program.description}</div>
                        <div className="flex justify-content-between text-sm text-gray-600">
                            <span>Số học viên: {program.min_student} - {program.max_student}</span>
                        </div>
                    </div>
                </div>
            </Card >
            <div className="card mt-3">
                <div className="font-semibold mb-2">Danh sách các khóa học và GV phụ trách:</div>
                <div className="grid">
                    {(programCourses.length ? programCourses : courses).map(course => (
                        <div className="col-12" key={course.id}>
                            <div className="flex flex-row align-items-center border-round p-3 mb-2 shadow-sm bg-white">
                                <div className="col-8">
                                    <div className="font-bold text-lg">{course.title}</div>
                                    <div className="flex align-items-center gap-3 mt-1">
                                        <span className="text-sm">Số buổi: <b>{course.planned_session}</b></span>
                                        <span className="text-sm flex align-items-center">
                                            GV: <b>{getTeacherName(course.teacher_id)}</b>
                                        </span>
                                        <span className="text-sm">Khai giảng: <b>{dateFormat(course.start_date)}</b></span>
                                        <span className="text-sm">{getStatusBadge(course.status)}</span>
                                    </div>
                                </div>
                                <div className="col-4 flex justify-content-end">
                                    <Button label="Xem chi tiết" icon="pi pi-info-circle" severity="info" onClick={() => navigate(`/course/detail?id=${course.id}`)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Card footer={footer}></Card>

        </>
    );
}

export default ProgramDetail;