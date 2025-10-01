import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Outlet, useNavigate, useParams } from "react-router-dom";
//mock:
import { courses } from "../../../mocks/mockCourses";
import { sessions } from "../../../mocks/mockSession";
import { teachers } from "../../../mocks/mockTeachers";
import { users } from "../../../mocks/mockUsers";

const CourseDetailTeacher = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const course = courses.find(c => c.id == courseId);

    const shortDate = date => {
        const d = new Date(date);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        })
            .format(d)
            .replace(/-/g, '/');
    };
    return (<>
        <div className="grid m-2">
            <div className="col-9 border-primary min-w-0"
            >
                <Outlet />
            </div>
            <div className="col-3"
                style={{ position: "sticky", top: "1rem", alignSelf: "flex-start" }}>
                <Panel header={course.title} className="shadow-6">
                    <Badge size="large"
                        value={`${course.current_session}/${course.total_session}`}
                    />
                    <Badge
                        severity={
                            course.status === 1
                                ? "success"
                                : course.status === 2
                                    ? "warning"
                                    : "danger"
                        }
                        size="large"
                        value={
                            course.status === 1
                                ? "Đang dạy"
                                : course.status === 2
                                    ? "Sắp mở"
                                    : "Đã hủy"
                        }
                        className="mt-2 ml-2"
                    />

                    <ul className="list-none pl-2 line-height-3" >
                        <li><i className="pi pi-building pr-2" style={{ fontSize: '1.5rem' }}></i>{course.room}</li>
                        <li><i className="pi pi-users pr-2" style={{ fontSize: '1.5rem' }}></i> {course.student_count}/{course.student_capacity}</li>
                        <li>
                            {
                                course.schedule.map((s, idx) => (
                                    <div key={idx}>
                                        <i className="pi pi-clock pr-2" style={{ fontSize: '1.5rem' }}></i>
                                        {s.day}, {s.time}
                                        {idx < course.schedule.length - 1}
                                    </div>
                                ))
                            }
                        </li>
                        <li><i className="pi pi-briefcase pr-2" style={{ fontSize: '1.5rem' }}></i>Nguyễn Văn A</li>
                        <li><i className="pi pi-user pr-2" style={{ fontSize: '1.5rem' }}></i>Trần Thị B</li>
                        <li><i className="pi pi-calendar pr-2" style={{ fontSize: '1.5rem' }}></i> {shortDate(course.start_date)} - {shortDate(course.end_date)}</li>
                    </ul>
                    <Divider />
                    <Button label="Danh sách học viên" onClick={() => navigate('student-list')} className="p-button-lg w-full mt-2" />
                    <Button label="Bảng điểm danh" onClick={() => navigate('attendance')} className="p-button-lg w-full mt-2" />
                    <Button label="Danh sách bài giảng" onClick={() => navigate('lesson')} className="p-button-lg w-full mt-2" />
                </Panel>
            </div>
        </div >
        <div>

        </div>
    </>);
}

export default CourseDetailTeacher;