import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import '../styles/NewStudentsTable.css';

function avatarTemplate(row){
    const initials = row.name.split(' ').map(n => n[0]).slice(0,2).join('');
    return <div className="avatar-circle">{initials}</div>;
}

function progressTemplate(row){
    return <div className="progress-cell"><ProgressBar value={row.progress} showValue={false} /></div>;
}

export default function NewStudentsTable({ students, onExport }){
    return (
        <Card>
            <div className="table-header">
                <h3>New Students</h3>
                <div>
                    <button className="p-button p-button-outlined" onClick={onExport}>Export CSV</button>
                </div>
            </div>
            <DataTable value={students} className="students-table" paginator rows={5}>
                <Column body={avatarTemplate} style={{width:70}} />
                <Column field="name" header="Student" />
                <Column field="course" header="Course" />
                <Column body={progressTemplate} header="Progress" style={{width:180}} />
                <Column field="status" header="Status" />
                <Column field="joinDate" header="Join Date" />
            </DataTable>
        </Card>
    );
}
