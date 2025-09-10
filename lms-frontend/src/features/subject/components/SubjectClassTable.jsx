// src/features/subject/components/SubjectClassTable.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const SubjectClassTable = ({ classes = [], onRegister }) => {
    if (!classes.length) return null;

    const actionBodyTemplate = (row) => (
        <Button
            label="Đăng ký"
            icon="pi pi-shopping-cart"
            size="small"
            onClick={() => onRegister(row.courseId, row.name, row.schedule, row.start)}
        />
    );

    const seatsBodyTemplate = (row) => {
        const [current, total] = row.seats.split('/').map(Number);
        const severity = current >= total * 0.8 ? 'danger' : current >= total * 0.6 ? 'warning' : 'success';
        return <Tag value={row.seats} severity={severity} />;
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Lớp Đang Mở</h2>
            <DataTable value={classes} responsiveLayout="scroll" className="p-datatable-striped">
                <Column field="name" header="Lớp" style={{ minWidth: '100px' }} />
                <Column field="start" header="Khai giảng" style={{ minWidth: '120px' }} />
                <Column field="schedule" header="Lịch học" style={{ minWidth: '200px' }} />
                <Column field="seats" header="Còn chỗ" body={seatsBodyTemplate} style={{ minWidth: '100px' }} />
                <Column header="Thao tác" body={actionBodyTemplate} style={{ minWidth: '120px' }} />
            </DataTable>

            <div className="mt-4 p-3 bg-blue-50 border-round border-left-3 border-blue-500">
                <h5 className="text-blue-900 mt-0">Thông tin thêm:</h5>
                <ul className="text-blue-800 text-sm">
                    <li>Học phí đã bao gồm tài liệu và certificate</li>
                    <li>Có thể học bù nếu vắng mặt có lý do</li>
                    <li>Hỗ trợ review và luyện tập thêm sau giờ</li>
                    <li>Cam kết hoàn phí 100% nếu không hài lòng trong 3 buổi đầu</li>
                </ul>
            </div>
        </Card>
    );
};

export default SubjectClassTable;
