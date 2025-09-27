import React, { useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';
import { confirmDialog } from 'primereact/confirmdialog';
import AddStudentDialog from '../components/AddStudentDialog.jsx';
import StatusTag from '../components/StatusTag';
import CourseChips from '../components/CourseChips';
import { searchStudents, classes, studentStatusOptions, upsertStudent, removeStudent } from '../mocks/students';

const toast = { current: { show: () => {} } };

export default function StudentManagerment(){
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [cls, setCls] = useState('');
    const [dlg, setDlg] = useState(false);
    const [edit, setEdit] = useState(null);

    const data = useMemo(()=> searchStudents({ q, status, cls }), [q,status,cls]);

    const left = (
        <div className="flex align-items-center gap-2">
            <span className="pi pi-filter text-xl"></span>
            <span className="text-lg font-semibold">Search & Filters</span>
        </div>
    );
    const right = (
        <div className="flex align-items-center gap-2">
            <Button label="Export" icon="pi pi-download" onClick={()=>{
                // export nhanh: copy dữ liệu sang CSV
                const headers = ['id','name','email','class','status','enrolledOn'];
                const csv = [headers.join(','), ...data.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(','))].join('\n');
                const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob); a.download = 'students.csv'; a.click();
            }} />
            <Button label="Add Student" icon="pi pi-plus" onClick={()=> { setEdit(null); setDlg(true); }} />
        </div>
    );

    const actions = row => (
        <div className="table-actions">
            <Button icon="pi pi-pencil" rounded text severity="info" onClick={()=> { setEdit(row); setDlg(true); }} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={()=> confirmDelete(row)} />
        </div>
    );

    function confirmDelete(row){
        confirmDialog({
            message:`Delete ${row.name}?`,
            header:'Confirm',
            acceptClassName:'p-button-danger',
            accept:()=>{
                removeStudent(row.id);
                toast.current?.show({ severity:'success', summary:'Deleted', detail:`${row.name} removed.` });
                // force rerender by slight query tweak
                setQ(q => q + ' ');
                setTimeout(()=> setQ(q=>q.trim()), 0);
            }
        });
    }

    function onSave(stu){
        upsertStudent(stu);
        toast.current?.show({ severity:'success', summary:'Saved', detail:`${stu.name} saved.` });
        setDlg(false);
        // refresh
        setQ(q => q + ' ');
        setTimeout(()=> setQ(q=>q.trim()), 0);
    }

    const headerFilters = (
        <div className="grid w-full">
            <div className="col-12 md:col-4">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText className="w-full" placeholder="Search by name, ID, or class..." value={q} onChange={e=>setQ(e.target.value)} />
        </span>
            </div>
            <div className="col-6 md:col-3">
                <Dropdown className="w-full" value={status} onChange={e=>setStatus(e.value)} options={studentStatusOptions} optionLabel="label" optionValue="value" placeholder="All Status" showClear />
            </div>
            <div className="col-6 md:col-3">
                <Dropdown className="w-full" value={cls} onChange={e=>setCls(e.value)} options={classes} optionLabel="label" optionValue="value" placeholder="All Classes" showClear />
            </div>
        </div>
    );

    const nameTemplate = row => (
        <div className="flex align-items-center gap-2">
            <Avatar image={row.avatar} label={!row.avatar ? row.name?.slice(0,1) : undefined} size="large" shape="circle" />
            <div className="flex flex-column">
                <span className="font-medium">{row.name}</span>
                <span className="sm-muted">{row.email}</span>
            </div>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="text-2xl font-bold mb-2">Student Management</div>
                <div className="sm-muted mb-3">Manage and track all student information</div>
            </div>

            <div className="col-12 card-quiet">
                <Toolbar start={left} end={right} className="mb-0" />
                <div className="p-3">{headerFilters}</div>
            </div>

            <div className="col-12 card-quiet p-3">
                <DataTable value={data} paginator rows={10} stripedRows responsiveLayout="scroll">
                    <Column header="Student" body={nameTemplate} />
                    <Column field="id" header="Student ID" />
                    <Column field="class" header="Class" />
                    <Column header="Courses" body={row => <CourseChips list={row.courses} />} />
                    <Column header="Status" body={row => <StatusTag value={row.status} />} />
                    <Column header="Enrollment Date" body={row => new Date(row.enrolledOn).toLocaleDateString()} />
                    <Column header="Actions" body={actions} exportable={false} style={{ width:'9rem' }} />
                </DataTable>
            </div>

            {dlg && <AddStudentDialog visible={dlg} onHide={()=>setDlg(false)} onSave={onSave} defaultValues={edit} />}
        </div>
    );
}
