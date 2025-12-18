import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const chipByPay = (val) => {
    const key = String(val || '').toLowerCase();
    const map = { paid:'is-paid', unpaid:'is-unpaid', refunded:'is-refunded', partial:'is-partial' };
    return <span className={`ne-chip ${map[key] || 'is-paid'}`}>{val}</span>;
};

const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-GB') : '-';

const fmtTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }) : '-';

export default function EnrollmentsTable({
                                             data,
                                             selected,
                                             setSelected,
                                             onView,
                                             onApprove,
                                             onReject,
                                             rows = 20,
                                         }) {
    const studentTmpl = (r) => (
        <div className="ne-student">
            <i className="pi pi-user" style={{ fontSize: 20, color: '#657289' }} />
            <div>
                <div className="ne-student-name">{r.studentName}</div>
                <div className="ne-id">Student ID: #{r.studentId}</div>
            </div>
        </div>
    );

    const contactTmpl = (r) => (
        <div style={{ display:'grid', gap:6 }} className="ne-ellipsis">
            <div className="ne-line"><i className="pi pi-envelope" /> {r.email}</div>
            <div className="ne-line"><i className="pi pi-phone" /> {r.phone}</div>
        </div>
    );

    const programTmpl = (r) => (
        <div style={{ display:'grid', gap:6 }}>
            <div className="ne-program">{r.programTitle}</div>
            <div className="ne-line ne-ellipsis"><i className="pi pi-bookmark" /> {r.subjectTitle}</div>
        </div>
    );

    const paymentTmpl = (r) => (
        <div style={{ display:'grid', gap:8 }}>
            {chipByPay(r.payStatus)}
            <div className="ne-line" style={{ fontSize:13 }}>
                {(r.payMethod || '').replace('_',' ')}
            </div>
        </div>
    );

    const statusTmpl = (r) =>
        <span className="ne-chip is-pending">{r.enrollStatus || 'Pending'}</span>;

    const appliedTmpl = (r) => (
        <div style={{ display:'grid', gap:2 }}>
            <div className="ne-applied">{fmtDate(r.lastPaymentAt)}</div>
            <div className="ne-id">{fmtTime(r.lastPaymentAt)}</div>
        </div>
    );

    const actionsTmpl = (r) => (
        <div className="ne-row-actions">
            <Button className="ne-btn-view" icon="pi pi-eye" onClick={() => onView?.(r)} />
            <Button className="ne-btn-ok"   icon="pi pi-check" onClick={() => onApprove?.([r])} />
            <Button className="ne-btn-x"    icon="pi pi-times" onClick={() => onReject?.([r])} />
        </div>
    );

    return (
        <div className="ne-card ne-table-card">
            <div className="ne-table">
                <DataTable
                    value={data}
                    dataKey="id"
                    selection={selected}
                    onSelectionChange={(e) => setSelected?.(e.value)}
                    rows={rows}
                    paginator
                    rowsPerPageOptions={[20, 50, 100]}
                    className="w-full"
                    rowClassName={() => 'ne-row'}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '48px' }} />

                    <Column header="STUDENT" body={studentTmpl} className="ne-col ne-col-student" />
                    <Column header="CONTACT" body={contactTmpl} className="ne-col ne-col-contact" />
                    <Column header="PROGRAM / COURSE" body={programTmpl} className="ne-col ne-col-program" />
                    <Column header="PAYMENT" body={paymentTmpl} className="ne-col ne-col-payment" />
                    <Column header="STATUS" body={statusTmpl} className="ne-col ne-col-status" />
                    <Column header="LAST PAYMENT" body={appliedTmpl} className="ne-col ne-col-applied" />
                    <Column
                        header="ACTIONS"
                        body={actionsTmpl}
                        className="ne-col ne-col-actions ne-actions-col"
                        style={{ width: 200, minWidth: 140 }}
                    />
                </DataTable>
            </div>
        </div>
    );
}
