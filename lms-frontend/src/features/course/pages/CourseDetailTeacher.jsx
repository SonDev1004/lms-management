import {Button} from "primereact/button";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const CourseDetailTeacher = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
console.log(state);
    return (<>
        <div>
            <Button label="Danh sách học viên" onClick={() => navigate('student-list',{state})} className="mr-2"/>
            <Button label="Bảng điểm danh" onClick={() => navigate('attendance')}/>
            <Outlet/>
        </div>
        <div>

        </div>
    </>);
}

export default CourseDetailTeacher;