import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

import TeacherFilters from '../components/TeacherFilters.jsx';
import TeachersTable from '../components/TeachersTable.jsx';
import EditTeacherDialog from '../components/EditTeacherDialog.jsx';
import AddTeacherDialog from '../components/AddTeacherDialog.jsx'; // ⬅️ NEW
import { confirmDelete } from '../components/ConfirmDelete.js';

import { useTeachers } from '../hooks/useTeachers.js';
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
                                              currentUserId, // nếu cần giới hạn teacher chỉ sửa chính mình
                                          }) {
    const toast = useRef(null);
    const navigate = useNavigate();
    const { data, filters, setFilters, exportCSV } = useTeachers();

    // Dialog states
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // Quyền
    const canDelete = role === 'ACADEMIC_MANAGER';
    const canEdit = useMemo(() => {
        if (role === 'ACADEMIC_MANAGER') return true;
        if (role === 'TEACHER' && editing) {
            return editing.id === currentUserId; // teacher chỉ sửa hồ sơ của mình
        }
        return role !== 'TEACHER'; // fallback
    }, [role, editing, currentUserId]);

    // Kích hoạt re-run searchTeachers trong hook sau khi CRUD mock store
    const forceRefresh = () => {
        setFilters.setQ((prev) => prev + ' ');
        setTimeout(() => setFilters.setQ((prev) => prev.trim()), 0);
    };

    // Table row actions
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

    // Save từ dialog SỬA
    const onSaveEdit = (t) => {
        if (!t?.name) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Name is required.',
            });
            return;
        }
        // giữ nguyên id khi edit
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

    // Save từ dialog THÊM
    const onSaveAdd = (t) => {
        if (!t?.name) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Name is required.',
            });
            return;
        }
        // Tạo id khi thêm mới
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
                <div className="title-block" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <i className="pi pi-briefcase title-icon" />
                    <div>
                        <h1 className="title" style={{ margin: 0 }}>Teacher Management</h1>
                        <div className="subtitle">Manage profiles, subjects & workloads</div>
                    </div>
                </div>

                {role === 'ACADEMIC_MANAGER' && (
                    <Button
                        label="Add Teacher"
                        icon="pi pi-plus"
                        className="p-button-lg"
                        onClick={() => {
                            setEditing(null);  // clear any stale edit
                            setAddOpen(true);  // ⬅️ mở dialog ADD RIÊNG
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
                    canEdit={canEdit}          // ⬅️ truyền đúng quyền
                    canDelete={canDelete}
                />
            </div>

            {/* Dialog SỬA */}
            {editOpen && (
                <EditTeacherDialog
                    open={editOpen}
                    onClose={() => {
                        setEditOpen(false);
                        setEditing(null);
                    }}
                    teacher={editing}                 // object cần sửa
                    onSaved={onSaveEdit}             // flow save riêng cho edit
                    departments={departments}
                    statusOptions={teacherStatusOptions}
                    empTypes={employmentTypes}
                    subjects={subjects}
                    dialogClassName="teacher-edit-dialog"
                />
            )}

            {/* Dialog THÊM (riêng) */}
            {addOpen && (
                <AddTeacherDialog
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    onSaved={onSaveAdd}              // flow save riêng cho add
                    departments={departments}
                    statusOptions={teacherStatusOptions}
                    empTypes={employmentTypes}
                    subjects={subjects}
                    dialogClassName="teacher-edit-dialog"  // tái dùng CSS đẹp đã có
                />
            )}
        </div>
    );
}
