import React from 'react';

export default function SummaryPills({ className = '' }) {
    return (
        <div className={className} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div className="summary-pill"><i className="pi pi-calendar"></i> Attendance 0%</div>
            <div className="summary-pill"><i className="pi pi-check-circle"></i> Practice 14.1%</div>
            <div className="summary-pill"><i className="pi pi-file"></i> Assignment 0%</div>
        </div>
    );
}