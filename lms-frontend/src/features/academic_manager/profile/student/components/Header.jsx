import React from 'react';
import { Button } from 'primereact/button';
import { cap, fmtDate } from '../../student/utils/studentProfile.utils';

export default function Header({ student, onEdit }) {
    return (
        <div className="sp-header">
            <div className="sp-left">
                <img
                    className="sp-avatar"
                    src={student.avatar || `https://i.pravatar.cc/120?u=${student.id}`}
                    alt={student.name}
                />
                <div>
                    <div className="sp-name">{student.name}</div>
                    <div className="sp-class">{student.class}</div>

                    <span className={`sp-status sp-status-${student.status || 'active'}`}>
            {cap(student.status || 'active')}
          </span>

                    <div className="sp-email">
                        <i className="pi pi-envelope" /> {student.email}
                    </div>
                </div>
            </div>

            <div className="sp-right">
                <Button
                    label="Edit Profile"
                    icon="pi pi-pencil"
                    className="p-button-primary sp-edit"
                    onClick={onEdit}
                />
                <div className="sp-metrics">
                    <div className="sp-metric">
                        <div className="sp-metric-label">Student ID</div>
                        <div className="sp-metric-value">{student.id}</div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label">GPA</div>
                        <div className="sp-metric-value sp-metric-gpa">
                            {Number.isFinite(student.gpa) ? student.gpa.toFixed(2) : student.gpa}
                        </div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label">
                            <i className="pi pi-calendar" /> Enrolled
                        </div>
                        <div className="sp-metric-value">{fmtDate(student.enrolledOn)}</div>
                    </div>
                    <div className="sp-metric">
                        <div className="sp-metric-label"><i className="pi pi-phone" /></div>
                        <div className="sp-metric-value">{student.phone}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
