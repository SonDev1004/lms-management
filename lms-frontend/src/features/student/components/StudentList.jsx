import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

//Hook
import { useNavigate, useParams } from 'react-router-dom';

//Mock
import { courses } from '../../../mocks/mockCourses';
import { students } from '../../../mocks/mockStudent';

const StudentList = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    //Show Student List dựa trên courseId trên URL thông qua useParams()
    const studentsInCourse = students.filter(stu => String(stu.courseId) === courseId);
    const course = courses.find(c => String(c.id) === courseId);
    const totalSession = course?.total_session || 0;

    return (
        <div>
            <h2>{course ? course.title : "Không tìm thấy lớp"}</h2>
            <div className="card">
                <DataTable showGridlines stripedRows value={studentsInCourse} tableStyle={{ minWidth: '50rem' }} paginator rows={10}  >
                    <Column field="id" header="ID" style={{ width: '2.5%' }}></Column>
                    <Column field="code" header="Mã học viên" style={{ width: '10%' }}></Column>
                    <Column field="name" header="Tên học viên"></Column>
                    <Column field="phone" header="Số điện thoại"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="status" header="Trạng thái"></Column>
                    <Column field="attendance" header="Chuyên cần" style={{ width: '15%' }}
                        body={rowData => `${rowData.attendanceCount}/${totalSession}`} />
                </DataTable >
                <Button className='mt-2'
                    label="Quay lại" onClick={() => navigate(-1)} />
                <Button className='ml-2'
                    label="Điểm danh" onClick={() => navigate(`/teacher/courses/${courseId}/attendance`)} />
            </div >
        </div>
    );
}

export default StudentList;