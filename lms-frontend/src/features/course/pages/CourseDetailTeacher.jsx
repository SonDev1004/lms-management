import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Outlet, useNavigate } from "react-router-dom";

const CourseDetailTeacher = () => {
    const navigate = useNavigate();
    return (<>
        <div>
            <Button label="Danh sách học viên" onClick={() => navigate('student-list')} className="mr-2" />
            <Button label="Bảng điểm danh" onClick={() => navigate('attendance')} />
            <Outlet />
            <Card
                className="flex justify-content-end flex-wrap"
            >
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-primary font-bold border-round m-2">1</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-primary font-bold border-round m-2">2</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-primary font-bold border-round m-2">3</div>
            </Card>

        </div>
        <div>

        </div>
    </>);
}

export default CourseDetailTeacher;