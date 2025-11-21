import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import classNames from 'classnames';
import AssignmentList from '../components/AssignmentList';
import { fetchAssignments } from '../api/assignmentService';
import '../styles/Assignment.css';

const AssignmentPage = ({ course, student }) => {
    const toast = useRef(null);
    const [assignments, setAssignments] = useState([]);
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [gradeDialog, setGradeDialog] = useState({ visible: false, assignment: null });

    useEffect(() => {
        let mounted = true;
        fetchAssignments(course?.id, student?.id).then((res) => {
            if (!mounted) return;
            setAssignments(res);
        });
        return () => { mounted = false; };
    }, [course, student]);

    const daysDiff = (d) => {
        if (!d) return null;
        const now = new Date();
        const due = new Date(d);
        const diffMs = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.ceil(diffMs / msPerDay);
    };

    const getAssignmentStatus = (a) => {
        // priority: graded -> submitted -> then by due date
        if (a.studentStatus === 'graded') return { kind: 'graded', label: `Graded`, variant: 'success' };
        if (a.studentStatus === 'submitted') return { kind: 'submitted', label: 'Submitted', variant: 'info' };
        const diff = daysDiff(a.due);
        if (diff == null) return { kind: 'pending', label: 'Not submitted', variant: 'neutral' };
        if (diff < 0) return { kind: 'overdue', label: `Not submitted`, variant: 'danger' };
        if (diff <= 3) return { kind: 'due_soon', label: `Due in ${diff} days`, variant: 'warning' };
        return { kind: 'pending', label: 'Not submitted', variant: 'neutral' };
    };

    const filteredAssignments = useMemo(() => {
        return assignments.filter((a) => {
            if (assignmentFilter === 'all') return true;
            const s = getAssignmentStatus(a);
            if (assignmentFilter === 'overdue') return s.kind === 'overdue';
            if (assignmentFilter === 'due_soon') return s.kind === 'due_soon';
            if (assignmentFilter === 'not_submitted') return s.kind === 'pending';
            if (assignmentFilter === 'submitted') return s.kind === 'submitted';
            if (assignmentFilter === 'graded') return s.kind === 'graded';
            return true;
        });
    }, [assignments, assignmentFilter]);

    const onUploadHandler = (event, assignmentId) => {
        const file = event.files && event.files[0];
        if (!file) return;
        const a = assignments.find((x) => x.id === assignmentId);
        if (!a) return;
        toast.current && toast.current.show({ severity: 'info', summary: 'Uploading', detail: file.name, life: 1200 });
        setTimeout(() => {
            setAssignments((prev) => prev.map((it) => (it.id === assignmentId ? {
                ...it,
                studentStatus: 'submitted'
            } : it)));
            toast.current && toast.current.show({
                severity: 'success',
                summary: 'Submission Successful',
                detail: a.title + ' has been submitted',
                life: 1600
            });
        }, 900);
    };

    const onViewGrade = (row) => {
        setGradeDialog({ visible: true, assignment: row });
    };

    return (
        <div className="assignment-root">
            <Toast ref={toast} />
            <div className="p-d-flex p-ai-center p-mb-2 p-flex-wrap assign-filter-row" style={{ gap: 12 }}>
                <div className="small-muted">Filter:</div>
                {['all', 'due_soon', 'overdue', 'not_submitted', 'submitted', 'graded'].map((k) => (
                    <Button
                        key={k}
                        className={classNames('assign-filter-btn', { 'p-button-text': assignmentFilter !== k })}
                        onClick={() => setAssignmentFilter(k)}
                        label={
                            k === 'all' ? 'All' :
                                k === 'due_soon' ? 'Due Soon' :
                                    k === 'overdue' ? 'Overdue' :
                                        k === 'not_submitted' ? 'Not Submitted' :
                                            k === 'submitted' ? 'Submitted' : 'Graded'
                        }
                    />
                ))}
            </div>

            <AssignmentList
                filteredAssignments={filteredAssignments}
                getAssignmentStatus={getAssignmentStatus}
                onUploadHandler={onUploadHandler}
                onViewGrade={onViewGrade}
            />

            <Dialog header={`Grade: ${gradeDialog.assignment?.title || ''}`} visible={gradeDialog.visible} modal
                onHide={() => setGradeDialog({ visible: false, assignment: null })}>
                {gradeDialog.assignment ? (
                    <div>
                        <p>Assignment: <strong>{gradeDialog.assignment.title}</strong></p>
                        <p>Grade: <strong>{gradeDialog.assignment.grade}</strong></p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button label="Close" className="p-button-text"
                                onClick={() => setGradeDialog({ visible: false, assignment: null })} />
                        </div>
                    </div>
                ) : <p>No data available</p>}
            </Dialog>
        </div>
    );
};

export default AssignmentPage;
