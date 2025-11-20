import React from 'react';
import { Dialog } from 'primereact/dialog';

export default function StudentProfileDialog({visible, onHide, data}){
    if(!data) return null;
    return (
        <Dialog header="Student Profile" visible={visible} onHide={onHide} className="ne-dialog" style={{width: '840px'}}>
            <div className="ne-section">
                <h4>Basic Information</h4>
                <div style={{lineHeight:'28px'}}>
                    <div><b>Full Name:</b> {data.name}</div>
                    <div><b>Student ID:</b> #{data.id}</div>
                    <div><b>Email:</b> {data.email}</div>
                    <div><b>Phone:</b> {data.phone}</div>
                    <div><b>Date of Birth:</b> 15/03/1995</div>
                    <div><b>Address:</b> 123 Main Street, District 1, Ho Chi Minh City</div>
                </div>
            </div>

            <div className="ne-section">
                <h4>Current Enrollment</h4>
                <div><b>Program:</b> {data.program}</div>
                <div><b>Course:</b> {data.course}</div>
                <div><b>Enrollment Status:</b> <span className="ne-chip ne-pending">Pending</span></div>
                <div><b>Payment Status:</b> <span className="ne-chip ne-paid">Paid</span></div>
                <div><b>Payment Method:</b> Cash</div>
                <div><b>Applied Date:</b> 20/10/2025 11:04</div>
            </div>

            <div className="ne-section">
                <h4>Academic Information</h4>
                <div><b>Current English Level:</b> Intermediate</div>
                <div><b>Emergency Contact:</b> Nguyen Van B - 0901234567</div>
                <div style={{marginTop:8}}>
                    <b>Previous Courses:</b>
                    <div>Basic English A1 — <span className="ne-chip ne-refunded">B+</span></div>
                    <div>Conversation Practice — <span className="ne-chip ne-refunded">A-</span></div>
                </div>
            </div>

            <div className="ne-section">
                <h4>Notes & Comments</h4>
                <div>Motivated student with good attendance record. Needs improvement in grammar.</div>
                <div style={{marginTop:8}}><b>Assigned Staff:</b> Admin IT</div>
            </div>
        </Dialog>
    );
}
