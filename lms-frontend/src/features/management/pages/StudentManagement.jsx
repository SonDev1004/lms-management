import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import AddStudentDialog from '../components/AddStudentDialog.jsx';
import CourseChips from '../components/CourseChips.jsx';
import StatusTag from '../components/StatusTag.jsx';

import {
    searchStudents,
    upsertStudent,
    removeStudent,
    classes,
    studentStatusOptions
} from '../mocks/students.js';

import '../styles/student-management.css';

export default function StudentManagement() {
    const toast = useRef(null);
    const navigate = useNavigate();

    // filters
    const [q, setQ] = useState('');
    const [status, setStatus] = useState(null);
    const [cls, setCls] = useState(null);

    // dialog state
    const [dlgOpen, setDlgOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // filtered data
    const data = useMemo(
        () => searchStudents({ q, status: status ?? '', cls: cls ?? '' }),
        [q, status, cls]
    );

    // ===== helpers =====
    const studentCell = (row) => (
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

    const dateCell = (row) =>
        new Date(row.enrolledOn).toLocaleDateString(undefined, {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });

    const actionsCell = (row) => (
        <div className="flex align-items-center gap-2">
            <Button
                icon="pi pi-eye"
                rounded
                text
                aria-label="View"
                onClick={() => navigate(`./${row.id}`)}
            />
            <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                aria-label="Edit"
                onClick={() => {
                    setEditing(row);
                    setDlgOpen(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete"
                onClick={() =>
                    confirmDialog({
                        header: 'Delete student',
                        message: `Remove ${row.name}?`,
                        acceptClassName: 'p-button-danger',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            removeStudent(row.id);
                            toast.current?.show({
                                severity: 'success',
                                summary: 'Deleted',
                                detail: `${row.name} removed.`
                            });
                            // refresh
                            setQ((v) => v + ' ');
                            setTimeout(() => setQ((v) => v.trim()), 0);
                        }
                    })
                }
            />
        </div>
    );

    function exportCSV() {
        if (!data.length) return;
        const headers = ['id', 'name', 'email', 'class', 'status', 'enrolledOn', 'gpa'];
        const csv = [
            headers.join(','),
            ...data.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'students.csv';
        a.click();
    }

    function onSave(stu) {
        if (!stu.id || !stu.name) return;
        upsertStudent(stu);
        setDlgOpen(false);
        toast.current?.show({
            severity: 'success',
            summary: editing ? 'Updated' : 'Added',
            detail: editing ? 'Student updated.' : 'New student added.'
        });
        setQ((v) => v + ' ');
        setTimeout(() => setQ((v) => v.trim()), 0);
    }

    // ===== render =====
    return (
        <div className="page-wrap">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />

            {/* Header */}
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-users title-icon" />
                    <div>
                        <h1 className="title">Student Management</h1>
                        <div className="subtitle">
                            Manage and track all student information
                        </div>
                    </div>
                </div>
                <Button
                    label="Add Student"
                    icon="pi pi-plus"
                    className="p-button-lg"
                    onClick={() => {
                        setEditing(null);
                        setDlgOpen(true);
                    }}
                />
            </div>

            {/* Search & Filters card */}
            <div className="card search-card">
                <div className="card-title">
                    <i className="pi pi-filter" />
                    <span>Search & Filters</span>
                </div>

                <div className="grid align-items-center">
                    <div className="col-12 md:col-5">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
                  className="w-full"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, ID, or class..."
              />
            </span>
                    </div>
                    <div className="col-6 md:col-3">
                        <Dropdown
                            className="w-full"
                            value={status}
                            onChange={(e) => setStatus(e.value)}
                            options={studentStatusOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Status"
                            showClear
                        />
                    </div>
                    <div className="col-6 md:col-3">
                        <Dropdown
                            className="w-full"
                            value={cls}
                            onChange={(e) => setCls(e.value)}
                            options={classes}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Classes"
                            showClear
                        />
                    </div>

                    {/* Export button phía phải giống ảnh */}
                    <div className="col-12 md:col-1 flex md:justify-content-end">
                        <Button label="Export" icon="pi pi-download" outlined onClick={exportCSV} />
                    </div>
                </div>
            </div>

            {/* Students table card */}
            <div className="card">
                <div className="section-title">Students ({data.length})</div>

                <DataTable
                    value={data}
                    paginator
                    rows={10}
                    stripedRows
                    responsiveLayout="scroll"
                    className="students-table"
                >
                    <Column header="Student" body={studentCell} />
                    <Column field="id" header="Student ID" />
                    <Column field="class" header="Class" />
                    <Column header="Courses" body={(r) => <CourseChips list={r.courses} />} />
                    <Column header="Status" body={(r) => <StatusTag value={r.status} />} />
                    <Column header="Enrollment Date" body={dateCell} />
                    <Column
                        header="Actions"
                        body={actionsCell}
                        exportable={false}
                        style={{ width: '8.5rem' }}
                    />
                </DataTable>
            </div>

            {dlgOpen && (
                <AddStudentDialog
                    visible={dlgOpen}
                    onHide={() => setDlgOpen(false)}
                    defaultValues={editing}
                    onSave={onSave}
                />
            )}
        </div>
    );
}
