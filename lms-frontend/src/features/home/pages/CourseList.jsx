import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { subjects } from '../../../mocks/mockSubject';

// const courses = [
//     {
//         title: "Tên Subject 1",
//         subTitle: "Course subtitle 1",
//         image: "https://www.studytienganh.vn/upload/2021/06/106292.jpg",
//         description: "Miêu tả khóa học 1."
//     },
//     {
//         title: "Tên Course 2",
//         subTitle: "Course subtitle 2",
//         image: "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png",
//         description: "Miêu tả khóa học 2."
//     },
//     {
//         title: "Tên course3",
//         subTitle: "Course subtitle 3",
//         image: "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp",
//         description: "Miêu tả khóa học 3."
//     }
// ];

const CourseList = () => {
    return (
        <Panel header="Môn học nỗi bật" className='p-4'>
            <div className="grid ">
                {subjects.slice(0, 3).map((subject, idx) => (
                    <div className="col-12 md:col-4" key={idx}>
                        <Card
                            title={subject.title}
                            header={
                                <div className="card-image-frame">
                                    <img className='card-image' alt="Card" src="https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" /></div>}
                            footer={
                                <>
                                    <Button label="Đăng ký" icon="pi pi-check" />
                                    <Button label="Xem chi tiết" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
                                </>
                            }
                            className="h-full"
                        >
                            <p className="m-0">{subject.description}</p>
                        </Card>
                    </div>
                ))}
            </div>
        </Panel>
    );
};

export default CourseList;