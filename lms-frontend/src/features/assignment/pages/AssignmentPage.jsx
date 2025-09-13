import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {Dialog} from 'primereact/dialog';
import {Tag} from 'primereact/tag';
import classNames from 'classnames';
import AssignmentList from '../components/AssignmentList';
import {fetchAssignments} from '../api/assignmentService';

const AssignmentPage = ({course, student}) => {
    const toast = useRef(null);
    const [assignments, setAssignments] = useState([]);
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [gradeDialog, setGradeDialog] = useState({visible: false, assignment: null});

    useEffect(() => {
        let mounted = true;
        fetchAssignments(course?.id, student?.id).then((res) => {
            if (!mounted) return;
            setAssignments(res);
        });
        return () => { mounted = false; };
    }, [course, student]);

    const formatDate = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const daysDiff = (d) => {
        if (!d) return null;
        const now = new Date();
        const due = new Date(d);
        const diffMs = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.ceil(diffMs / msPerDay);
    };

    const getAssignmentStatus = (a) => {
        if (a.studentStatus === 'graded') return {kind: 'graded', label: `Điểm ${a.grade}`, variant: 'success'};
        if (a.studentStatus === 'submitted') return {kind: 'submitted', label: 'Đã nộp', variant: 'info'};
        const diff = daysDiff(a.due);
        if (diff == null) return {kind: 'pending', label: 'Chưa nộp', variant: 'neutral'};
        if (diff < 0) return {kind: 'overdue', label: `Quá hạn ${Math.abs(diff)} ngày`, variant: 'danger'};
        if (diff <= 3) return {kind: 'due_soon', label: `Còn ${diff} ngày`, variant: 'warning'};
        return {kind: 'pending', label: 'Chưa nộp', variant: 'neutral'};
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
        toast.current && toast.current.show({severity: 'info', summary: 'Đang tải lên', detail: file.name, life: 1200});
        setTimeout(() => {
            setAssignments((prev) => prev.map((it) => (it.id === assignmentId ? {
                ...it,
                studentStatus: 'submitted'
            } : it)));
            toast.current && toast.current.show({
                severity: 'success',
                summary: 'Nộp bài thành công',
                detail: a.title + ' đã nộp',
                life: 1600
            });
        }, 900);
    };

    const onViewGrade = (row) => {
        setGradeDialog({visible: true, assignment: row});
    };

    return (
        <div className="assignment-root">
            <Toast ref={toast}/>
            <div className="p-d-flex p-ai-center p-mb-2 p-flex-wrap" style={{gap: 12}}>
                <div className="small-muted">Bộ lọc:</div>
                {['all', 'due_soon', 'overdue', 'not_submitted', 'submitted', 'graded'].map((k) => (
                    <Button
                        key={k}
                        className={classNames('assign-filter-btn', {'p-button-text': assignmentFilter !== k})}
                        onClick={() => setAssignmentFilter(k)}
                        label={
                            k === 'all' ? 'Tất cả' :
                                k === 'due_soon' ? 'Sắp hết hạn' :
                                    k === 'overdue' ? 'Quá hạn' :
                                        k === 'not_submitted' ? 'Chưa nộp' :
                                            k === 'submitted' ? 'Đã nộp' : 'Đã chấm'
                        }
                    />
                ))}
            </div>

            <AssignmentList
                assignments={assignments}
                filteredAssignments={filteredAssignments}
                getAssignmentStatus={getAssignmentStatus}
                onUploadHandler={onUploadHandler}
                onViewGrade={onViewGrade}
            />

            <Dialog header={`Điểm: ${gradeDialog.assignment?.title || ''}`} visible={gradeDialog.visible} modal
                    onHide={() => setGradeDialog({visible: false, assignment: null})}>
                {gradeDialog.assignment ? (
                    <div>
                        <p>Bài: <strong>{gradeDialog.assignment.title}</strong></p>
                        <p>Điểm: <strong>{gradeDialog.assignment.grade}</strong></p>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button label="Đóng" className="p-button-text"
                                    onClick={() => setGradeDialog({visible: false, assignment: null})}/>
                        </div>
                    </div>
                ) : <p>Không có dữ liệu</p>}
            </Dialog>
        </div>
    );
};

export default AssignmentPage;
