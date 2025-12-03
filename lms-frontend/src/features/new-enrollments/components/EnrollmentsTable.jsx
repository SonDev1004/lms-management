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
    new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' });

const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });

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
                <div className="ne-student-name">{r.name}</div>
                <div className="ne-id">ID: #{r.id}</div>
            </div>
        </div>
    );

    const contactTmpl = (r) => (
        <div style={{ display:'grid', gap:6 }} className="ne-ellipsis">
            <div className="ne-line"><i className="pi pi-envelope" />{r.email}</div>
            <div className="ne-line"><i className="pi pi-phone" />{r.phone}</div>
        </div>
    );

    const programTmpl = (r) => (
        <div style={{ display:'grid', gap:6 }}>
            <div className="ne-program">{r.program}</div>
            <div className="ne-line ne-ellipsis"><i className="pi pi-bookmark" />{r.course}</div>
        </div>
    );

    const paymentTmpl = (r) => (
        <div style={{ display:'grid', gap:8 }}>
            {chipByPay(r.payStatus)}
            <div className="ne-line" style={{ fontSize:13 }}>{String(r.payMethod || '').replace('_',' ')}</div>
        </div>
    );

    const statusTmpl = () => <span className="ne-chip is-pending">Pending</span>;

    const appliedTmpl = (r) => (
        <div style={{ display:'grid', gap:2 }}>
            <div className="ne-applied">{fmtDate(r.applied)}</div>
            <div className="ne-id">{fmtTime(r.applied)}</div>
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

                    <Column header="STUDENT" body={studentTmpl} className="ne-col ne-col-student" sortable />
                    <Column header="CONTACT" body={contactTmpl} className="ne-col ne-col-contact" />
                    <Column header="PROGRAM / COURSE" body={programTmpl} className="ne-col ne-col-program" />
                    <Column header="PAYMENT" body={paymentTmpl} className="ne-col ne-col-payment" />
                    <Column header="STATUS" body={statusTmpl} className="ne-col ne-col-status" sortable />
                    <Column header="APPLIED" body={appliedTmpl} className="ne-col ne-col-applied" sortable />
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
