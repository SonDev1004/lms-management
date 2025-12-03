import React, { useEffect, useMemo, useRef, useState } from 'react';
import SummaryPills from '../components/SummaryPills.jsx';
import CoursesTable from '../components/CoursesTable.jsx';
import useStaffCourseList from '../hooks/useStaffCourseList.js';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import AddCourseDialog from '../components/AddCourseDialog.jsx';
import CourseDetailDialog from '../components/CourseDetailDialog.jsx';

export default function CourseList() {
    const toast = useRef(null);
    const {
        stats, courses, selected, onSelectionChange, selectAll, clearSelection, loading, query, setQuery,
    } = useStaffCourseList();

    const [localCourses, setLocalCourses] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [detail, setDetail] = useState({ visible: false, course: null });

    // ===== Filters =====
    const [classFilter, setClassFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [teacherFilter, setTeacherFilter] = useState(null);

    // Debounced search
    const [searchText, setSearchText] = useState(query);
    useEffect(() => setSearchText(query), [query]);
    useEffect(() => { const t = setTimeout(() => setQuery(searchText), 350); return () => clearTimeout(t); }, [searchText, setQuery]);

    useEffect(() => setLocalCourses(courses), [courses]);

    const classOptions = useMemo(() => ([
        { label: 'All Classes', value: null },
        { label: 'Class A', value: 'Class A' },
        { label: 'Class B', value: 'Class B' },
        { label: 'Class C', value: 'Class C' },
    ]), []);
    const statusOptions = useMemo(() => ([
        { label: 'All Status', value: null },
        { label: 'active', value: 'active' },
        { label: 'inactive', value: 'inactive' },
    ]), []);

    const teacherOptions = useMemo(() => {
        const uniq = Array.from(new Set(localCourses.map(c => c.teacher).filter(Boolean)));
        return [{ label: 'All Teachers', value: null }, ...uniq.map(t => ({ label: t, value: t }))];
    }, [localCourses]);

    const filteredCourses = useMemo(() => {
        return localCourses.filter((c) => {
            const q = (query || '').trim().toLowerCase();
            if (q && !(c.title?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q) || c.teacher?.toLowerCase().includes(q))) return false;
            if (classFilter && c.class !== classFilter) return false;
            if (statusFilter && c.status !== statusFilter) return false;
            if (teacherFilter && c.teacher !== teacherFilter) return false;
            return true;
        });
    }, [localCourses, query, classFilter, statusFilter, teacherFilter]);

    // ===== Add course =====
    function handleAddOpen() { setShowAdd(true); }
    function handleAddSave(payload) {
        const newId = `COURSE${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
        const course = {
            id: newId,
            title: payload.title,
            class: payload.class,
            teacher: payload.teacher,
            startDate: payload.startDate,
            endDate: payload.endDate,
            capacity: payload.capacity ?? 0,
            enrolled: payload.enrolled ?? 0,
            status: payload.status,
        };
        setLocalCourses(prev => [course, ...prev]);
        setShowAdd(false);
        toast.current.show({ severity: 'success', summary: 'Added', detail: `Course "${course.title}" added` });
    }

    // ===== View detail / CRUD =====
    function handleViewDetail(course) { setDetail({ visible: true, course }); }
    function handleUpdateCourse(updated) {
        setLocalCourses(prev => prev.map(c => (c.id === updated.id ? { ...c, ...updated } : c)));
        toast.current.show({ severity: 'success', summary: 'Updated', detail: `Course "${updated.title}" updated` });
    }
    function handleDeleteCourse(id) {
        setLocalCourses(prev => prev.filter(c => c.id !== id));
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Course deleted' });
    }

    // ===== Bulk delete from toolbar =====
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

    function clearAllFilters() { setClassFilter(null); setStatusFilter(null); setTeacherFilter(null); }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Toast ref={toast} />
            <div style={{ flex: 1 }}>
                <SummaryPills stats={stats} />

                {/* Filter Bar */}
                <div className="course-toolbar">
                    <div className="course-toolbar-left">
        <span className="p-input-icon-left course-search">
            <i className="pi pi-search" />
            <InputText
                placeholder="Search by course, ID, or teacher…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </span>

                        <div className="course-filter-group">
                            <Dropdown
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.value)}
                                options={classOptions}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Classes"
                                showClear
                            />

                            <Dropdown
                                value={teacherFilter}
                                onChange={(e) => setTeacherFilter(e.value)}
                                options={teacherOptions}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Teachers"
                                showClear
                            />

                            <Dropdown
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.value)}
                                options={statusOptions}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="All Status"
                                showClear
                            />
                        </div>
                    </div>

                    <div className="course-toolbar-right">
                        <Button label="Import" icon="pi pi-upload" className="p-button-outlined" />
                        <Button
                            label="Export"
                            icon="pi pi-download"
                            className="p-button-outlined"
                            onClick={() =>
                                toast.current.show({ severity: 'info', summary: 'Export', detail: 'Export is mocked' })
                            }
                        />
                        <Button label="+ Add Course" icon="pi pi-plus" className="p-button-success" onClick={handleAddOpen} />
                    </div>
                </div>



                {(classFilter || statusFilter || teacherFilter) && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', padding: 8 }}>
                        {classFilter && <span>Class: {classFilter}</span>}
                        {teacherFilter && <span>Teacher: {teacherFilter}</span>}
                        {statusFilter && <span>Status: {statusFilter}</span>}
                        <Button label="Clear filters" className="p-button-text" onClick={clearAllFilters} />
                    </div>
                )}

                {selected.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, alignItems: 'center' }}>
                        <div>
                            <strong>{selected.length}</strong> courses selected
                            <Button label="Select All" icon="pi pi-check-square" className="p-button-text" onClick={selectAll} />
                            <Button label="Clear" icon="pi pi-times" className="p-button-text" onClick={clearSelection} />
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
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
                    onView={handleViewDetail}
                    onEdit={handleViewDetail}
                    onDelete={(c) => handleDeleteCourse(c.id)}
                />

                {/* Add Course */}
                <AddCourseDialog
                    visible={showAdd}
                    onClose={() => setShowAdd(false)}
                    onSave={handleAddSave}
                    classOptions={classOptions.slice(1)}
                    statusOptions={[
                        { label: 'active', value: 'active' },
                        { label: 'inactive', value: 'inactive' },
                    ]}
                />

                {/* View Detail */}
                <CourseDetailDialog
                    visible={detail.visible}
                    onClose={() => setDetail({ visible: false, course: null })}
                    course={detail.course}
                    classOptions={[
                        { label: 'Class A', value: 'Class A' },
                        { label: 'Class B', value: 'Class B' },
                        { label: 'Class C', value: 'Class C' },
                    ]}
                    onUpdate={handleUpdateCourse}
                    onDelete={handleDeleteCourse}
                />
            </div>
        </div>
    );
}
