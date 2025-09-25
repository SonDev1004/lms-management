import React, { useEffect, useMemo, useRef, useState } from 'react';
import SummaryPills from '../components/SummaryPills.jsx';
import CoursesTable from '../components/CoursesTable.jsx'; // ⬅ đổi
import useStaffCourseList from '../hooks/useStaffCourseList.js'; // đã refactor trả về courses
import '../styles/Index.css';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

export default function CourseList() {
    const toast = useRef(null);
    const {
        stats,
        courses,
        selected,
        onSelectionChange,
        selectAll,
        clearSelection,
        loading,
        query,
        setQuery,
    } = useStaffCourseList();

    const [localCourses, setLocalCourses] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        class: 'Class A',
        teacher: '',
        startDate: '',
        endDate: '',
        capacity: 20,
        enrolled: 0,
        status: 'active',
    });

    // filters
    const [classFilter, setClassFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [teacherFilter, setTeacherFilter] = useState(null);

    // debounced search
    const [searchText, setSearchText] = useState(query);
    useEffect(() => setSearchText(query), [query]);
    useEffect(() => {
        const t = setTimeout(() => setQuery(searchText), 350);
        return () => clearTimeout(t);
    }, [searchText, setQuery]);

    useEffect(() => setLocalCourses(courses), [courses]);

    const classOptions = useMemo(
        () => [
            { label: 'All Classes', value: null },
            { label: 'Class A', value: 'Class A' },
            { label: 'Class B', value: 'Class B' },
            { label: 'Class C', value: 'Class C' },
        ],
        []
    );
    const statusOptions = useMemo(
        () => [
            { label: 'All Status', value: null },
            { label: 'active', value: 'active' },
            { label: 'inactive', value: 'inactive' },
        ],
        []
    );
    const teacherOptions = useMemo(() => {
        const uniq = Array.from(new Set(localCourses.map(c => c.teacher).filter(Boolean)));
        return [{ label: 'All Teachers', value: null }, ...uniq.map(t => ({ label: t, value: t }))];
    }, [localCourses]);

    const filteredCourses = useMemo(() => {
        return localCourses.filter((c) => {
            const q = (query || '').trim().toLowerCase();
            if (
                q &&
                !(
                    c.title?.toLowerCase().includes(q) ||
                    c.id?.toLowerCase().includes(q) ||
                    c.teacher?.toLowerCase().includes(q)
                )
            ) return false;
            if (classFilter && c.class !== classFilter) return false;
            if (statusFilter && c.status !== statusFilter) return false;
            if (teacherFilter && c.teacher !== teacherFilter) return false;
            return true;
        });
    }, [localCourses, query, classFilter, statusFilter, teacherFilter]);

    function handleAddOpen() {
        setNewCourse({
            title: '',
            class: 'Class A',
            teacher: '',
            startDate: '',
            endDate: '',
            capacity: 20,
            enrolled: 0,
            status: 'active',
        });
        setShowAdd(true);
    }

    function handleAddSave() {
        if (!newCourse.title || !newCourse.teacher) {
            toast.current.show({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Course name and teacher are required',
                life: 2500,
            });
            return;
        }
        const newId = `COURSE${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
        const payload = { id: newId, ...newCourse };
        setLocalCourses((prev) => [payload, ...prev]);
        setShowAdd(false);
        toast.current.show({ severity: 'success', summary: 'Added', detail: `Course ${payload.title} added` });
    }

    function handleDeleteSelected() {
        if (selected.length === 0) {
            toast.current.show({ severity: 'info', summary: 'No selection', detail: 'Please select at least one course.' });
            return;
        }
        const ids = new Set(selected.map((c) => c.id));
        setLocalCourses((prev) => prev.filter((c) => !ids.has(c.id)));
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: `${selected.length} courses removed` });
        clearSelection();
    }

    function clearAllFilters() {
        setClassFilter(null);
        setStatusFilter(null);
        setTeacherFilter(null);
    }

    return (
        <div className="dashboard-root" style={{ gap: 16 }}>
            <Toast ref={toast} />
            <div style={{ flex: 1 }}>
                <SummaryPills stats={stats} />

                {/* Sticky Filter Bar */}
                <div className="p-card p-p-3 header-row sticky">
                    <div className="toolbar-left">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                  placeholder="Search by course, ID, or teacher…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 360 }}
              />
            </span>

                        <Dropdown
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.value)}
                            options={classOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Classes"
                            style={{ width: 150 }}
                            showClear
                        />
                        <Dropdown
                            value={teacherFilter}
                            onChange={(e) => setTeacherFilter(e.value)}
                            options={teacherOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Teachers"
                            style={{ width: 170 }}
                            showClear
                        />
                        <Dropdown
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.value)}
                            options={statusOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Status"
                            style={{ width: 140 }}
                            showClear
                        />
                    </div>

                    <div className="toolbar-right">
                        <Button label="Import" icon="pi pi-upload" className="p-button-outlined" />
                        <Button
                            label="Export"
                            icon="pi pi-download"
                            className="p-button-outlined"
                            onClick={() => toast.current.show({ severity: 'info', summary: 'Export', detail: 'Export is mocked' })}
                        />
                        <Button label="+ Add Course" icon="pi pi-plus" className="p-button-success" onClick={handleAddOpen} />
                    </div>
                </div>

                {(classFilter || statusFilter || teacherFilter) && (
                    <div className="chips-row">
                        {classFilter && <span className="chip">Class: {classFilter}</span>}
                        {teacherFilter && <span className="chip">Teacher: {teacherFilter}</span>}
                        {statusFilter && <span className="chip">Status: {statusFilter}</span>}
                        <Button label="Clear filters" className="p-button-text" onClick={clearAllFilters} />
                    </div>
                )}

                {selected.length > 0 && (
                    <div className="p-card p-p-3 action-container">
                        <div className="action-left">
                            <div><strong>{selected.length}</strong> courses selected</div>
                            <Button label="Select All" icon="pi pi-check-square" className="p-button-text" onClick={selectAll} />
                            <Button label="Clear" icon="pi pi-times" className="p-button-text" onClick={clearSelection} />
                        </div>

                        <div className="action-right">
                            <Button label="Activate" icon="pi pi-check" className="p-button-outlined"
                                    onClick={() => toast.current.show({ severity: 'success', summary: 'Activate', detail: 'Activated selected (mock)' })}/>
                            <Button label="Deactivate" icon="pi pi-ban" className="p-button-outlined"
                                    onClick={() => toast.current.show({ severity: 'success', summary: 'Deactivate', detail: 'Deactivated selected (mock)' })}/>
                            <Button label="Export Selected" icon="pi pi-download" className="p-button-outlined"
                                    onClick={() => toast.current.show({ severity: 'info', summary: 'Export', detail: 'Export selected (mock)' })}/>
                            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDeleteSelected} />
                        </div>
                    </div>
                )}

                <CoursesTable
                    courses={filteredCourses}
                    selected={selected}
                    onSelectionChange={onSelectionChange}
                    loading={loading}
                />

                {/* Add Course dialog */}
                <Dialog header="Add Course" visible={showAdd} style={{ width: 520 }} modal onHide={() => setShowAdd(false)}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label>Course name</label>
                            <InputText value={newCourse.title} onChange={(e) => setNewCourse(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="p-field">
                            <label>Teacher</label>
                            <InputText value={newCourse.teacher} onChange={(e) => setNewCourse(p => ({ ...p, teacher: e.target.value }))} />
                        </div>
                        <div className="p-field p-grid">
                            <div className="p-col-6">
                                <label>Class</label>
                                <Dropdown
                                    value={newCourse.class}
                                    options={classOptions.slice(1)}
                                    optionLabel="label"
                                    optionValue="value"
                                    onChange={(e) => setNewCourse(p => ({ ...p, class: e.value }))}
                                />
                            </div>
                            <div className="p-col-6">
                                <label>Status</label>
                                <Dropdown
                                    value={newCourse.status}
                                    options={[{ label: 'active', value: 'active' }, { label: 'inactive', value: 'inactive' }]}
                                    optionLabel="label"
                                    optionValue="value"
                                    onChange={(e) => setNewCourse(p => ({ ...p, status: e.value }))}
                                />
                            </div>
                        </div>

                        <div className="p-field p-grid">
                            <div className="p-col-6">
                                <label>Start date</label>
                                <InputText placeholder="YYYY-MM-DD"
                                           value={newCourse.startDate}
                                           onChange={(e) => setNewCourse(p => ({ ...p, startDate: e.target.value }))}/>
                            </div>
                            <div className="p-col-6">
                                <label>End date</label>
                                <InputText placeholder="YYYY-MM-DD"
                                           value={newCourse.endDate}
                                           onChange={(e) => setNewCourse(p => ({ ...p, endDate: e.target.value }))}/>
                            </div>
                        </div>

                        <div className="p-field p-grid">
                            <div className="p-col-6">
                                <label>Capacity</label>
                                <InputNumber value={newCourse.capacity} onValueChange={(e) => setNewCourse(p => ({ ...p, capacity: e.value ?? 0 }))} showButtons min={0} />
                            </div>
                            <div className="p-col-6">
                                <label>Enrolled</label>
                                <InputNumber value={newCourse.enrolled} onValueChange={(e) => setNewCourse(p => ({ ...p, enrolled: e.value ?? 0 }))} showButtons min={0} />
                            </div>
                        </div>

                        <div className="dialog-actions">
                            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowAdd(false)} />
                            <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={handleAddSave} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
