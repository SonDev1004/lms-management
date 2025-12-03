import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

import TeacherFilters from '../components/TeacherFilters.jsx';
import TeachersTable from '../components/TeachersTable.jsx';
import EditTeacherDialog from '../components/EditTeacherDialog.jsx';
import AddTeacherDialog from '../components/AddTeacherDialog.jsx';
import { confirmDelete } from '../components/ConfirmDelete.js';

import { useTeachers } from '../hooks/useTeachers.js';

import '../styles/TeacherManagement.css';
import '../styles/TeacherEditDialog.css';

import {
    departments,
    teacherStatusOptions,
    employmentTypes,
    upsertTeacher,
    removeTeacher,
} from '../mocks/teachers.js';

export default function TeacherManagement({
                                              role = 'ACADEMIC_MANAGER',
                                              subjects = [],
                                              currentUserId,
                                          }) {
    const toast = useRef(null);
    const navigate = useNavigate();
    const { data, filters, setFilters, exportCSV } = useTeachers();

    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const canDelete = role === 'ACADEMIC_MANAGER';
    const canEdit = useMemo(() => {
        if (role === 'ACADEMIC_MANAGER') return true;
        if (role === 'TEACHER' && editing) {
            return editing.id === currentUserId;
        }
        return role !== 'TEACHER';
    }, [role, editing, currentUserId]);

    const forceRefresh = () => {
        setFilters.setQ((prev) => prev + ' ');
        setTimeout(() => setFilters.setQ((prev) => prev.trim()), 0);
    };

    const onView = (row) => navigate(`./${row.id}`);

    const onEdit = (row) => {
        setEditing(row || null);
        setEditOpen(true);
    };

    const onDelete = (row) =>
        confirmDelete({
            name: row.name,
            onAccept: () => {
                removeTeacher(row.id);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: `${row.name} removed.`,
                    life: 2200,
                });
                forceRefresh();
            },
        });

    const onSaveEdit = (t) => {
        if (!t?.name) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Name is required.',
            });
            return;
        }
        const payload = t.id?.trim() ? t : { ...t, id: editing?.id || '' };
        upsertTeacher(payload);

        setEditOpen(false);
        setEditing(null);

        toast.current?.show({
            severity: 'success',
            summary: 'Updated',
            detail: 'Teacher profile updated.',
            life: 2000,
        });

        forceRefresh();
    };

    const onSaveAdd = (t) => {
        if (!t?.name) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Name is required.',
            });
            return;
        }

        const withId =
            t.id && t.id.trim()
                ? t
                : { ...t, id: `T${Math.floor(1000 + Math.random() * 9000)}` };

        upsertTeacher(withId);
        setAddOpen(false);

        toast.current?.show({
            severity: 'success',
            summary: 'Added',
            detail: 'New teacher created.',
            life: 2000,
        });

        forceRefresh();
    };

    return (
        <div className="page-wrap">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />

            {/* Header */}
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-briefcase title-icon" />
                    <div>
                        <h1 className="title">Teacher Management</h1>
                        <div className="subtitle">Manage profiles, subjects & workloads</div>
                    </div>
                </div>

                {role === 'ACADEMIC_MANAGER' && (
                    <Button
                        label="Add Teacher"
                        icon="pi pi-plus"
                        className="p-button-lg"
                        onClick={() => {
                            setEditing(null);
                            setAddOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Filters */}
            <TeacherFilters
                value={filters}
                onChange={setFilters}
                onExport={exportCSV}
                departments={departments}
                statusOptions={teacherStatusOptions}
                subjects={subjects}
                empTypes={employmentTypes}
            />

            {/* Table */}
            <div className="card">
                <div className="section-title">Teachers ({data.length})</div>
                <TeachersTable
                    data={data}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            </div>

            {/* Edit dialog */}
            {editOpen && (
                <EditTeacherDialog
                    open={editOpen}
                    onClose={() => {
                        setEditOpen(false);
                        setEditing(null);
                    }}
                    teacher={editing}
                    onSaved={onSaveEdit}
                    departments={departments}
                    statusOptions={teacherStatusOptions}
                    empTypes={employmentTypes}
                    subjects={subjects}
                    dialogClassName="teacher-edit-dialog"
                />
            )}

            {/* Add dialog */}
            {addOpen && (
                <AddTeacherDialog
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    onSaved={onSaveAdd}
                    departments={departments}
                    statusOptions={teacherStatusOptions}
                    empTypes={employmentTypes}
                    subjects={subjects}
                    dialogClassName="teacher-edit-dialog"
                />
            )}
        </div>
    );
}
