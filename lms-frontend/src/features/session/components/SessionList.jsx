//React
import { Accordion, AccordionTab } from "primereact/accordion";

//mock
import { sessions } from "../../../mocks/mockSession";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const SessionList = () => {
    const navigate = useNavigate();
    // Hàm format ngày thành dd/mm
    const shortDate = date => {
        const d = new Date(date);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        })
            .format(d)
            .replace(/-/g, '/');
    };

    const sessionFiles = file_names => (
        <>
            {file_names.map(item => (
                <>
                    <Button icon='pi pi-paperclip' label={item} className="mt-2 mr-2"></Button>
                </>
            ))}
        </>
    );

    const showSessionList = () => {
        return sessions.map(session => {
            return (
                <AccordionTab key={session.id} disabled={session.disabled}
                    header={<div className="flex flex wrap justify-content-between">
                        <div className="flex">Buổi {session.order}: {shortDate(session.date)}</div>
                        <div className="flex">Sĩ số: {session.student_count}/{session.student_count} </div>
                    </div>
                    }
                >
                    {session.description}
                    <div>{sessionFiles(session.file_names)}</div>
                </AccordionTab >

            );
        })
    };

    return (<div>
        <h1>Danh sách buổi học</h1>
        <Accordion>{showSessionList()}</Accordion>
        <Button
            className="mt-2"
            label='Quay lại'
            onClick={() => navigate(-1)}
        />
    </div>);
}

export default SessionList;