// src/features/subject/components/SubjectClassTable.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const formatDate = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr; // fallback nếu backend trả không phải ISO
    return d.toLocaleDateString('vi-VN');
};

const SubjectClassTable = ({ classes = [], onRegister }) => {
    if (!classes.length) {
        return (
            <Card>
                <h2 className="text-2xl font-bold mb-4">Lớp Đang Mở</h2>
                <div className="p-4 text-center text-gray-600">
                    Chưa có lớp nào được mở cho môn này.
                </div>
            </Card>
        );
    }

    const actionBodyTemplate = (row) => (
        <Button
            label="Đăng ký"
            icon="pi pi-shopping-cart"
            size="small"
            onClick={() => onRegister?.(row.courseId, row.courseTitle, row.schedule, row.startDate)}
        />
    );

    const startBodyTemplate = (row) => formatDate(row.startDate);

    const capacityBodyTemplate = (row) => (
        <Tag value={`${row.capacity ?? 0} chỗ`} />
    );

    const statusBodyTemplate = (row) => (
        row.statusName ? <Tag value={row.statusName} /> : null
    );

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Lớp Đang Mở</h2>
            <DataTable value={classes} responsiveLayout="scroll" className="p-datatable-striped">
                <Column field="courseTitle" header="Lớp" style={{ minWidth: '160px' }} />
                <Column field="startDate" header="Khai giảng" body={startBodyTemplate} style={{ minWidth: '120px' }} />
                <Column field="schedule" header="Lịch học" style={{ minWidth: '200px' }} />
                <Column field="capacity" header="Sức chứa" body={capacityBodyTemplate} style={{ minWidth: '110px' }} />
                <Column field="statusName" header="Trạng thái" body={statusBodyTemplate} style={{ minWidth: '130px' }} />
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
