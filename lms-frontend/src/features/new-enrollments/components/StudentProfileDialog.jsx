import React from 'react';
import { Dialog } from 'primereact/dialog';

export default function StudentProfileDialog({ visible, onHide, data }) {
    if (!data) return null;

    return (
        <Dialog
            header="Student Profile"
            visible={visible}
            onHide={onHide}
            className="ne-dialog"
            style={{ width: '840px' }}
        >
            <div className="ne-section">
                <h4>Basic Information</h4>
                <div style={{ lineHeight: '28px' }}>
                    <div><b>Full Name:</b> {data.studentName}</div>
                    <div><b>Student ID:</b> #{data.studentId}</div>
                    <div><b>Email:</b> {data.email}</div>
                    <div><b>Phone:</b> {data.phone}</div>
                </div>
            </div>

            <div className="ne-section">
                <h4>Current Enrollment</h4>
                <div><b>Program:</b> {data.programTitle}</div>
                <div><b>Course:</b> {data.subjectTitle}</div>
                <div><b>Payment Status:</b> {data.payStatus}</div>
                <div><b>Payment Method:</b> {data.payMethod}</div>
                <div><b>Last Payment:</b> {data.lastPaymentAt}</div>
            </div>

            <div className="ne-section">
                <h4>Notes</h4>
                <div>No additional notes.</div>
            </div>
        </Dialog>
    );
}
