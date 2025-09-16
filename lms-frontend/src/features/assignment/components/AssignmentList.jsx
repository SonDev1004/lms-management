// features/assignment/components/AssignmentList.jsx
import React from 'react';
import classNames from 'classnames';
import {FileUpload} from 'primereact/fileupload';
import {Button} from 'primereact/button';
import {Tag} from 'primereact/tag';

const AssignmentList = ({ filteredAssignments, getAssignmentStatus, onUploadHandler, onViewGrade}) => {
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
        <div className="assignments-table p-mt-2">
            <ul className="assignments-list" role="list">
                {filteredAssignments.map((row) => {
                    const s = getAssignmentStatus(row);
                    const diff = (() => {
                        if (!row.due) return null;
                        const now = new Date();
                        const due = new Date(row.due);
                        const msPerDay = 24 * 60 * 60 * 1000;
                        return Math.ceil((due.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / msPerDay);
                    })();
                    const overdue = diff != null && diff < 0;
                    return (
                        <li key={row.id}
                            className={classNames('assignment-row', {overdue: overdue})}
                            tabIndex={0} aria-label={`Bài tập ${row.title}`}>
                            <div className="ar-col ar-col--title">
                                <div className="assign-title">
                                    <span className="assign-icon" aria-hidden>{assignmentIcon(row)}</span>
                                    <span className="assign-title-text">{row.title}</span>
                                </div>
                                <div className="assign-sub small-muted">{row.subject || ''}</div>
                            </div>

                            <div className="ar-col ar-col--due">
                                <div className="due-date">{row.due ? new Date(row.due).toLocaleDateString() : ''}</div>
                                <div className="due-meta small-muted">
                                    {diff == null ? '' : (diff < 0 ? `Quá hạn ${Math.abs(diff)} ngày` : (diff === 0 ? 'Hôm nay' : `Còn ${diff} ngày`))}
                                </div>
                            </div>

                            <div className="ar-col ar-col--status">
                                <Tag value={getAssignmentStatus(row).label} severity={
                                    getAssignmentStatus(row).variant === 'danger' ? 'danger' :
                                        getAssignmentStatus(row).variant === 'success' ? 'success' :
                                            getAssignmentStatus(row).variant === 'info' ? 'info' : undefined
                                } className="p-mr-2 p-py-2"/>
                            </div>

                            <div className="ar-col ar-col--action">
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

                                {s.kind === 'submitted' && (
                                    <Button label="Đã nộp" icon="pi pi-check" disabled className="btn-submitted"/>
                                )}

                                {s.kind === 'graded' && (
                                    <Button className="p-button-text btn-view-grade"
                                            label={`Xem điểm ${row.grade}`}
                                            onClick={() => onViewGrade(row)}/>
                                )}
                            </div>
                        </li>
                    );
                })}
                {filteredAssignments.length === 0 && <li className="assign-empty small-muted">Không có bài tập phù hợp bộ lọc.</li>}
            </ul>
        </div>
    );
};

export default AssignmentList;
