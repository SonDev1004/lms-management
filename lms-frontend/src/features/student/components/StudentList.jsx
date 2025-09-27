import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';

//Hook
import {useLocation, useNavigate, useParams} from 'react-router-dom';


const StudentList = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const {id} = useParams();

    const payload = state?.payload ?? {};
    const studentsInCourse = payload.students ?? [];
    const courseTitle = payload.courseTitle ?? `Course #${id}`;
    const courseId = payload.courseId ?? id;
    const totalSession = studentsInCourse[0]?.plannedSessions ?? 0;
    return (
        <div>
            <h2>{courseTitle}</h2>
            <div className="card">
                <DataTable showGridlines stripedRows value={studentsInCourse} tableStyle={{minWidth: '50rem'}} paginator
                           rows={10} emptyMessage="Chưa có học viên"
                >
                    <Column
                        header="STT"
                        style={{ width: '5%' }}
                        body={(_, options) => options.rowIndex + 1}
                    />                    <Column field="code" header="Mã học viên" style={{width: '10%'}}></Column>
                    <Column field="name" header="Tên học viên"></Column>
                    <Column field="phome"
                            header="Số điện thoại"
                            body={rowData => formatPhone(rowData.phone)}
                    ></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="statusName" header="Trạng thái"></Column>
                    <Column
                        header="Chuyên cần"
                        style={{ width: '15%' }}
                        body={rowData =>
                            `${rowData.presentCount}/${rowData.plannedSessions ?? totalSession}`
                        }
                    />
                </DataTable>
                <Button className='mt-2'
                        label="Quay lại" onClick={() => navigate(-1)}/>
                <Button className='ml-2'
                        label="Điểm danh" onClick={() => navigate(`/teacher/courses/${courseId}/attendance`)}/>
            </div>
        </div>
    );
}

export default StudentList;
function formatPhone(phone) {
if (!phone) return "";
const digits = phone.replace(/\D/g, "");
let normalized = digits;
if (normalized.startsWith("84") && normalized.length === 11) {
    normalized = "0" + normalized.slice(2);
}
if (normalized.length === 10) {
    return normalized.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");
}
if (normalized.length === 11) {
    return normalized.replace(/(\d{4})(\d{3})(\d{4})/, "$1.$2.$3");
}
return phone;
}