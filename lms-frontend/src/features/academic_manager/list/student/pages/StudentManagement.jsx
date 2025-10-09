import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

import HeaderBar from '../components/HeaderBar.jsx';
import StudentFilters from '../components/StudentFilters.jsx';
import StudentsTable from '../components/StudentsTable.jsx';
import AddStudentDialog from '../components/AddStudentDialog.jsx';
import { confirmDelete } from '../components/ConfirmDelete.js';

import { useStudents } from '../hooks/useStudents.js';
import { classes, studentStatusOptions, upsertStudent, removeStudent } from '../mocks/students.js';

import '../styles/student-management.css';

export default function StudentManagement() {
    const toast = useRef(null);
    const navigate = useNavigate();

    const { data, filters, setFilters, exportCSV } = useStudents();
    const [dlgOpen, setDlgOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const onView = (row) => navigate(`./${row.id}`);
    const onEdit = (row) => { setEditing(row); setDlgOpen(true); };
    const onDelete = (row) =>
        confirmDelete({
            name: row.name,
            onAccept: () => {
                removeStudent(row.id);
                toast.current?.show({ severity: 'success', summary: 'Deleted', detail: `${row.name} removed.` });
                setFilters.setQ((v) => v + ' '); setTimeout(() => setFilters.setQ((v) => v.trim()), 0);
            },
        });

    const onSave = (stu) => {
        if (!stu.id || !stu.name) return;
        upsertStudent(stu);
        setDlgOpen(false);
        toast.current?.show({
            severity: 'success',
            summary: editing ? 'Updated' : 'Added',
            detail: editing ? 'Student updated.' : 'New student added.',
        });
        setFilters.setQ((v) => v + ' '); setTimeout(() => setFilters.setQ((v) => v.trim()), 0);
    };

    return (
        <div className="page-wrap">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />

            <HeaderBar onAdd={() => { setEditing(null); setDlgOpen(true); }} />

            <StudentFilters
                value={filters}
                onChange={setFilters}
                onExport={exportCSV}
                classes={classes}
                statusOptions={studentStatusOptions}
            />

            <div className="card">
                <div className="section-title">Students ({data.length})</div>
                <StudentsTable data={data} onView={onView} onEdit={onEdit} onDelete={onDelete} />
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
