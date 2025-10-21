import React from 'react';
import classNames from 'classnames';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../styles/Assignment.css';

const AssignmentList = ({ filteredAssignments, getAssignmentStatus, onUploadHandler, onViewGrade }) => {
    const assignmentIcon = (a) => {
        const t = (a.subject || a.title || '').toLowerCase();
        if (t.includes('reading')) return '📘';
        if (t.includes('writing') || t.includes('essay')) return '✍️';
        if (t.includes('listening')) return '🎧';
        if (t.includes('speaking')) return '🎤';
        if (t.includes('grammar')) return '📝';
        if (t.includes('vocab') || t.includes('vocabulary')) return '📚';
        return '📄';
    };

    return (
        <div className="assignments">
            <ul className="assignments-list" role="list">
                {filteredAssignments.map((row) => {
                    const s = getAssignmentStatus(row);
                    // compute days diff for possible display, but don't show overdue when submitted/graded
                    const diff = (() => {
                        if (!row.due) return null;
                        const now = new Date();
                        const due = new Date(row.due);
                        const msPerDay = 24 * 60 * 60 * 1000;
                        return Math.ceil((due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / msPerDay);
                    })();
                    const showOverdueText = diff != null && diff < 0 && !(row.studentStatus === 'submitted' || row.studentStatus === 'graded');

                    return (
                        <li key={row.id}
                            className={classNames('assignment-row', { overdue: showOverdueText })}
                            tabIndex={0} aria-label={`Assignment ${row.title}`}>
                            {/* Column 1: Title */}
                            <div className="ar-col ar-col--title">
                                <div className="assign-title">
                                    <span className="assign-icon" aria-hidden>{assignmentIcon(row)}</span>
                                    <div className="assign-title-main">
                                        <span className="assign-title-text">{row.title}</span>
                                        <div className="assign-sub small-muted">{row.subject || ''}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Due date (chỉ hiển thị ngày) */}
                            <div className="ar-col ar-col--due">
                                <div className="due-date">{row.due ? new Date(row.due).toLocaleDateString() : ''}</div>
                            </div>

                            {/* Column 3: Status (Tag + overdue text nếu có và chưa nộp) */}
                            <div className="ar-col ar-col--status">
                                <div className="status-block">
                                    <Tag
                                        value={s.kind === 'graded' ? 'Graded' : s.label}
                                        severity={
                                            s.variant === 'danger' ? 'danger' :
                                                s.variant === 'success' ? 'success' :
                                                    s.variant === 'warning' ? 'warning' :
                                                        s.variant === 'info' ? 'info' : undefined
                                        }
                                        className="p-mr-2 p-py-2 status-tag"
                                    />
                                    {showOverdueText && <div className="overdue-text"> Overdue by {Math.abs(diff)} days</div>}
                                </div>
                            </div>

                            {/* Column 4: Actions (Coi đề, Nộp, Nút điểm khi đã chấm) */}
                            <div className="ar-col ar-col--action">
                                <div className="action-row">
                                    {/* View assignment file */}
                                    {row.fileUrl && (
                                        <Button
                                            icon="pi pi-eye"
                                            className="p-button-text btn-view"
                                            label="Coi đề"
                                            onClick={() => window.open(row.fileUrl, '_blank')}
                                        />
                                    )}

                                    {/* Upload button: only when allowed (pending, due_soon, overdue) */}
                                    {(s.kind === 'pending' || s.kind === 'due_soon' || s.kind === 'overdue') && (
                                        <div className="action-upload">
                                            <FileUpload
                                                mode="basic"
                                                name="file"
                                                customUpload
                                                accept=".pdf,.doc,.docx"
                                                maxFileSize={20 * 1024 * 1024}
                                                chooseLabel="Nộp"
                                                uploadHandler={(e) => onUploadHandler(e, row.id)}
                                                multiple={false}
                                                auto={true}
                                                className="btn-upload"
                                            />
                                        </div>
                                    )}

                                    {/* If submitted but not graded: show simple label in status (we removed check button from action) */}
                                    {/* If graded: show grade button (click => view grade dialog) */}
                                    {s.kind === 'graded' && (
                                        <Button
                                            className="p-button-outlined btn-grade"
                                            label={`${row.grade}`}
                                            onClick={() => onViewGrade(row)}
                                        />
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
                {filteredAssignments.length === 0 && <li className="assign-empty small-muted">No assignments match the filter.</li>}
            </ul>
        </div>
    );
};

export default AssignmentList;