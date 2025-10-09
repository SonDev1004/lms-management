import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import CourseChips from './CourseChips.jsx';
import StatusTag from './StatusTag.jsx';

import '../styles/student-management.css';

function StudentCell(row) {
    return (
        <div className="flex align-items-center gap-2">
            <Avatar
                image={row.avatar}
                label={!row.avatar ? row.name?.slice(0, 1) : undefined}
                size="large"
                shape="circle"
            />
            <div className="flex flex-column">
                <span className="font-medium">{row.name}</span>
                <span className="text-500">{row.email}</span>
            </div>
        </div>
    );
}

function DateCell(row) {
    return new Date(row.enrolledOn).toLocaleDateString(undefined, {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function StudentsTable({ data, onView, onEdit, onDelete }) {
    const ActionsCell = (row) => (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-eye" rounded text aria-label="View" onClick={() => onView(row)} />
            <Button icon="pi pi-pencil" rounded text severity="info" aria-label="Edit" onClick={() => onEdit(row)} />
            <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Delete" onClick={() => onDelete(row)} />
        </div>
    );

    return (
        <DataTable value={data} paginator rows={10} stripedRows responsiveLayout="scroll" className="students-table">
            <Column header="Student" body={StudentCell} />
            <Column field="id" header="Student ID" />
            <Column field="class" header="Class" />
            <Column header="Courses" body={(r) => <CourseChips list={r.courses} />} />
            <Column header="Status" body={(r) => <StatusTag value={r.status} />} />
            <Column header="Enrollment Date" body={DateCell} />
            <Column header="Actions" body={ActionsCell} exportable={false} style={{ width: '8.5rem' }} />
        </DataTable>
    );
}
