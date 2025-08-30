import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../../styles/custom-theme.css';
import { programsDetail } from "../../services/mockProgramsDetail";

const ProgramList = () => {
    const navigate = useNavigate();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);

    const currentPrograms = programsDetail
        .filter(program => program.is_active === 1 || program.is_active === 2)
        .sort((a, b) => {
            if (a.is_active === b.is_active) return 0;
            return a.is_active === 1 ? -1 : 1;
        })
        .slice(first, first + rows);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <span className="badge badge-open">Đang mở</span>;
            case 2: return <span className="badge badge-upcoming">Sắp mở</span>;
            default: return null;
        }
    };

    //Đổi thành VND
    const formatVND = (number) => number?.toLocaleString('vi-VN') + 'đ';

    return (<>
        <div className="mt-2">
            {/* Ảnh bìa */}
            <img className="landscape-image shadow-4" src="https://www.shutterstock.com/image-vector/nature-study-forest-composition-outdoor-260nw-1932189083.jpg" />
            <Card className="mt-2" title="Danh sách chương trình học" />
            <div className="grid mt-2 ">
                {currentPrograms.map((programDetail, idx) => (
                    <div className="col-12 md:col-4" key={programDetail.id || idx}>
                        <Card
                            title={programDetail.title}
                            header={
                                <div className="card-image-frame">
                                    <img src={programDetail.image} alt={programDetail.title} className="card-image" />
                                </div>}


                            footer={
                                <div className="flex justify-content-evenly flex-wrap">
                                    <div className="flex align-items-center justify-content-center m-2">
                                        <Button label="Đăng ký"
                                            icon="pi pi-eye"
                                            onClick={() => navigate(`/`)} />
                                    </div>
                                    <div className="flex align-items-center justify-content-center  m-2">
                                        <Button label="Xem chi tiết"
                                            severity="secondary"
                                            icon="pi pi-times"
                                            style={{ marginLeft: '0.5em' }}
                                            onClick={() => navigate(`/program/${programDetail.id}`)} />
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex justify-content-between flex-wrap">
                                <div className="fee flex align-items-center justify-content-center ">{formatVND(programDetail.fee)}</div>
                                <div className="flex align-items-center justify-content-center h-4rem m-2 "> {programDetail.is_active === 1 ? (
                                    <h4 className="badge badge-open">Đang mở</h4>
                                ) : programDetail.is_active === 2 ? (
                                    <h4 className="badge badge-upcoming">Sắp mở</h4>
                                ) : null}</div>
                            </div>
                            <p className="m-0">{programDetail.description}</p>
                        </Card>
                    </div>
                ))}
            </div>
        </div >
        <Paginator
            first={first}
            rows={rows}
            totalRecords={programsDetail.length}
            onPageChange={onPageChange} className="mt-2"
        />
    </>);
}

export default ProgramList;