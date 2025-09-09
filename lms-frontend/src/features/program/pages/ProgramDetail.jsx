import { useParams, useNavigate } from "react-router-dom";
import { programsDetail } from "../../../mocks/mockProgramsDetail.js";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import dateFormat from "dateformat";
import { useEffect } from "react";


import { courses } from "../../../mocks/mockCourses.js";
import { teachers } from "../../../mocks/mockTeachers.js";
import { users } from "../../../mocks/mockUsers.js";
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

    //SubjectList trong ProgramDetail
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

    //Lọc subject cho program hiện tại
    const programSubjects = subjects.filter(c => c.program_id === program.id);

    return (
        <>
            <Card className="mt-2">
                <img className=" landscape-image shadow-4" src="https://www.dexerto.com/cdn-image/wp-content/uploads/2024/12/04/HSR-new-banner-1.jpg" />
                <div className="grid align-items-center mb-3" >
                    <div className="col-4">
                        <h2>{program.title}</h2>
                    </div>
                    <div className="col-4 flex justify-content-center">
                        <h2>{program.fee}</h2>
                    </div>
                    <div className="col-4 flex justify-content-end">
                        {program.is_active === 1 ? (
                            <h4 className="badge badge-open">Đang mở</h4>
                        ) : program.is_active === 0 ? (
                            <h4 className="badge badge-closed">Đang đóng</h4>
                        ) : program.is_active === 2 ? (
                            <h4 className="badge badge-upcoming">Sắp mở</h4>
                        ) : null}
                    </div>
                    <Divider />
                    <div className="grid col-12">
                        <div className="col-6">
                            {program.description}
                            <div>
                                <span>Số học viên: {program.min_student} - {program.max_student}</span>
                            </div>
                        </div>
                        <div className="col-6 flex justify-content-end">
                            <Button label="Đăng ký toàn chương trình" />
                        </div>
                    </div>
                </div>
            </Card >
            <Card className="mt-4">
                <div className="font-semibold flex justify-content-center text-lg">Danh sách các môn trong chương trình</div>
                <div className="card">
                    {(programSubjects.length ? programSubjects : subjects).map(subject => (
                        <div className="" key={subject.id}>
                            <Accordion>
                                <AccordionTab header={subject.title} >
                                    <div className="grid col-12">
                                        <p className="m-0 col-6">{subject.description} </p>
                                        <div className="col-6 flex justify-content-end">
                                            <Button label='Đăng ký môn này'></Button>
                                        </div>
                                    </div>
                                    {
                                        lessons.filter(lesson => lesson.subject_id === subject.id).map(lesson => (
                                            <div key={lesson.id} className="mb-3">
                                                <div className="flex align-items-center justify-content-between">
                                                    <div>
                                                        <b>{lesson.title}</b>
                                                    </div>
                                                </div>
                                                <div>{lesson.content}</div>
                                                <div><i>{lesson.description}</i></div>
                                                <Divider />
                                            </div>
                                        ))
                                    }
                                </AccordionTab>
                            </Accordion>
                        </div>
                    ))}
                </div>
            </Card>
            <Card footer={footer}></Card>

        </>
    );
}

export default ProgramDetail;