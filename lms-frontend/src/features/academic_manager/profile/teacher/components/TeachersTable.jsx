import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import StatusTag from './StatusTag';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

export default function TeachersTable({ data }) {
    const navigate = useNavigate();
    const [global, setGlobal] = useState('');

    const subjectsBody = (row) =>
        (row.subjects || []).map(s => <span key={s} className="chip">{s}</span>);

    const actionsBody = (row) => (
        <>
            <Button icon="pi pi-eye" rounded text className="mr-2" onClick={() => navigate(`/staff/teacher-list/${row.id}`)} />
            <Button icon="pi pi-pencil" rounded text className="mr-2" />
            <Button icon="pi pi-trash" rounded text severity="danger" />
        </>
    );

    return (
        <>
            <div className="tp-toolbar mb-3">
                <InputText value={global} onChange={(e)=>setGlobal(e.target.value)} placeholder="Search teachers…" className="w-20rem" />
            </div>
            <DataTable value={data} paginator rows={10} showGridlines responsiveLayout="scroll"
                       rowHover onRowClick={(e)=>navigate(`/staff/teacher-list/${e.data.id}`)}
                       globalFilter={global} emptyMessage="No teachers.">
                <Column field="name" header="Teacher" sortable />
                <Column field="code" header="Code" />
                <Column field="department" header="Department" sortable />
                <Column header="Subjects" body={subjectsBody} />
                <Column header="Status" body={(r)=><StatusTag value={r.status} />} />
                <Column header="Actions" body={actionsBody} style={{ width: 160 }} />
            </DataTable>
        </>
    );
}
