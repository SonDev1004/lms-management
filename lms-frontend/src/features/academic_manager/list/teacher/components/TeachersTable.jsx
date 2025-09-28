import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

function TeacherCell(row) {
    return (
        <div className="flex align-items-center gap-2">
            <Avatar image={row.avatar} label={!row.avatar ? row.name?.slice(0,1) : undefined} size="large" shape="circle" />
            <div className="flex flex-column">
                <span className="font-medium">{row.name}</span>
                <span className="text-500">{row.email}</span>
            </div>
        </div>
    );
}
function SubjectsCell(row){
    const list = row.subjects||[];
    return (
        <div className="flex align-items-center flex-wrap gap-2">
            {list.slice(0,2).map(s => <span key={s} className="p-badge p-component">{s}</span>)}
            {list.length>2 && <Badge value={`+${list.length-2}`} />}
        </div>
    );
}
function StatusTag({ value }) {
    const severity = value==='active' ? 'success' : value==='on_leave' ? 'warning' : 'danger';
    return <span className={`p-tag p-tag-${severity}`}>{value?.replace('_',' ')}</span>;
}

export default function TeachersTable({ data, onView, onEdit, onDelete, canEdit, canDelete }) {
    const Actions = (row) => (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-eye" rounded text aria-label="View" onClick={()=>onView(row)} />
            {canEdit && <Button icon="pi pi-pencil" rounded text severity="info" onClick={()=>onEdit(row)} />}
            {canDelete && <Button icon="pi pi-trash" rounded text severity="danger" onClick={()=>onDelete(row)} />}
        </div>
    );
    return (
        <DataTable value={data} paginator rows={10} stripedRows responsiveLayout="scroll">
            <Column header="Teacher" body={TeacherCell} />
            <Column field="id" header="Code" />
            <Column field="department" header="Department" />
            <Column header="Subjects" body={SubjectsCell} />
            <Column header="Status" body={(r)=><StatusTag value={r.status} />} />
            <Column field="hiredOn" header="Hired" body={(r)=>new Date(r.hiredOn).toLocaleDateString()} />
            <Column header="Actions" body={Actions} exportable={false} style={{ width: '9rem' }} />
        </DataTable>
    );
}
