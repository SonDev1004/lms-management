import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';

import SubjectChips from './SubjectChips.jsx';
import '../styles/subjectchip.css';

function TeacherCell(row) {
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

function StatusTag({ value }) {
    const severity =
        value === 'active'
            ? 'success'
            : value === 'on_leave'
                ? 'warning'
                : 'danger';

    const label = (value || '')
        .replace('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return <Tag value={label} severity={severity} className="rounded" />;
}

export default function TeachersTable({ data, onView, onEdit, onDelete, canEdit, canDelete }) {
    const Actions = (row) => (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-eye" rounded text aria-label="View" onClick={() => onView(row)} />
            {canEdit && (
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    aria-label="Edit"
                    onClick={() => onEdit(row)}
                />
            )}
            {canDelete && (
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    aria-label="Delete"
                    onClick={() => onDelete(row)}
                />
            )}
        </div>
    );

    return (
        <DataTable
            value={data}
            paginator
            rows={10}
            stripedRows
            responsiveLayout="scroll"
            className="students-table"
        >
            <Column header="Teacher" body={TeacherCell} />
            <Column field="id" header="Code" />
            <Column field="department" header="Department" />
            <Column header="Subjects" body={(row) => <SubjectChips list={row.subjects} />} />
            <Column header="Status" body={(r) => <StatusTag value={r.status} />} />
            <Column
                field="hiredOn"
                header="Hired"
                body={(r) => new Date(r.hiredOn).toLocaleDateString()}
            />
            <Column header="Actions" body={Actions} exportable={false} style={{ width: '9rem' }} />
        </DataTable>
    );
}
