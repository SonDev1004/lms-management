import React from 'react';
import { Toast } from 'primereact/toast';

import '../styles/tokens.css';
import '../styles/page.css';
import '../styles/filters.css';
import '../styles/table.css';
import '../styles/dialogs.css';
import '../styles/paginator.css';

import PageHeader from '../components/PageHeader';
import FiltersPanel from '../components/FiltersPanel';
import QuickActionsBar from '../components/QuickActionsBar';
import EnrollmentsTable from '../components/EnrollmentsTable';
import StudentProfileDialog from '../components/StudentProfileDialog';
import ActionNoteDialog from '../components/ActionNoteDialog';
import { fetchLatestEnrollments  } from '@/features/new-enrollments/api/enrollmentSerivce.js';

const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const dayEnd   = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const safeDate = (v) => { if (!v) return null; const dt = new Date(v); return isNaN(dt.getTime()) ? null : dt; };
const csvEscape = (v) => `"${String(v ?? '').replace(/"/g,'""')}"`;

export default function NewEnrollmentsPage() {
    const toast = React.useRef(null);

    const [filters, setFilters] = React.useState({
        query:'', status:null, payStatus:null, from:null, to:null, program:null, course:null,
    });

    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selected, setSelected] = React.useState([]);

    const [profile, setProfile] = React.useState({ visible:false, data:null });
    const [approveDlg, setApproveDlg] = React.useState(false);
    const [rejectDlg, setRejectDlg] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                const pageData = await fetchLatestEnrollments({ page: 0, size: 200 });

                if (!alive) return;
                setRows(Array.isArray(pageData.content) ? pageData.content : []);
            } catch (err) {
                if (alive) {
                    setRows([]);
                    toast.current?.show({
                        severity: "error",
                        summary: "Load failed",
                        detail: err?.message || "Could not fetch enrollments.",
                        life: 3000,
                    });
                    console.error("[NewEnrollments] fetchLatestEnrollments failed:", err);
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            alive = false;
        };
    }, []);


    const filteredRows = React.useMemo(() => {
        const q = (filters.query || '').trim().toLowerCase();
        return rows.filter((r) => {

            const status = r?.enrollStatus ?? r?.status ?? 'Pending';
            const program = r?.programTitle || '';
            const course  = r?.subjectTitle || '';

            const matchQ =
                !q || [
                    r?.studentName,
                    r?.email,
                    r?.phone,
                    String(r?.id),
                    program,
                    course
                ].some(x => String(x || '').toLowerCase().includes(q));

            const matchStatus = !filters.status || filters.status === status;
            const matchPay    = !filters.payStatus || filters.payStatus === r?.payStatus;

            const dt = safeDate(r?.lastPaymentAt);
            const matchFrom = !filters.from || (dt && dt >= dayStart(filters.from));
            const matchTo   = !filters.to   || (dt && dt <= dayEnd(filters.to));

            const matchProgram = !filters.program || String(filters.program) === String(r.programId);
            const matchCourse  = !filters.course  || String(filters.course)  === String(r.subjectId);

            return matchQ && matchStatus && matchPay && matchFrom && matchTo && matchProgram && matchCourse;
        });
    }, [rows, filters]);


    React.useEffect(() => {
        setSelected(prev => prev.filter(sel => filteredRows.some(r => r.id === sel.id)));
    }, [filteredRows]);

    const onView = (r) => setProfile({ visible:true, data:r });

    const onApprove = (items=[]) => { setSelected(Array.isArray(items) ? items : []); setApproveDlg(true); };
    const onReject  = (items=[]) => { setSelected(Array.isArray(items) ? items : []); setRejectDlg(true); };

    const handleBulk = (action) => async (note) => {
        const ids = selected.map(x => x.id);
        if (!ids.length) {
            toast.current?.show({ severity:'warn', summary:'No selection', detail:'Please select at least one enrollment.', life:2500 });
            return;
        }
        try {
            setSubmitting(true);
            console.debug(`[${action}]`, { ids, note });
            toast.current?.show({ severity:'success', summary: action==='APPROVE'?'Approved':'Rejected', detail:`${ids.length} request(s) processed.`, life:2500 });

            setRows(prev => prev.map(r => ids.includes(r.id)
                ? { ...r, enrollStatus: action==='APPROVE' ? 'Approved' : 'Rejected' } : r));
            setSelected([]);
            action==='APPROVE' ? setApproveDlg(false) : setRejectDlg(false);
        } catch (e) {
            toast.current?.show({ severity:'error', summary:'Action failed', detail:'Could not complete the action. Please retry.', life:3500 });
            console.error(`[${action}] failed:`, e);
        } finally {
            setSubmitting(false);
        }
    };
    const applyBulkApprove = handleBulk('APPROVE');
    const applyBulkReject  = handleBulk('REJECT');

    const resetFilters = () => setFilters({ query:'', status:null, payStatus:null, from:null, to:null, program:null, course:null });

    const exportCSV = () => {
        try {
            const header = ['ID','Name','Email','Phone','Program','Course','Payment Status','Enrollment Status','Applied']
                .map(csvEscape).join(',');
            const body = filteredRows.map(r => ([
                r?.id,
                r?.studentName,
                r?.email,
                r?.phone,
                r?.programTitle,
                r?.subjectTitle,
                r?.payStatus,
                (r?.enrollStatus ?? r?.status ?? 'Pending'),
                r?.lastPaymentAt
            ].map(csvEscape).join(','))).join('\n');

            const csv = [header, body].join('\n');
            const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'new_enrollments.csv'; a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            toast.current?.show({ severity:'error', summary:'Export failed', detail:'Could not export CSV.', life:3000 });
            console.error('[NewEnrollments] exportCSV error:', e);
        }
    };

    return (
        <div className="ne-wrap">
            <Toast ref={toast} />
            <div className="ne-container">
                <PageHeader />
                <div className="ne-onecol">
                    <FiltersPanel
                        state={filters}
                        setState={setFilters}
                        onReset={resetFilters}
                        onExport={exportCSV}
                        showSearch={false}
                        programOptions={[]}
                        courseOptions={[]}
                    />

                    <div className="ne-card">
                        <QuickActionsBar
                            selected={selected}
                            onBulkApprove={() => onApprove(selected)}
                            onBulkReject={() => onReject(selected)}
                            search={filters.query}
                            onSearch={(v) => setFilters((f) => ({ ...f, query: v }))}
                        />

                        <EnrollmentsTable
                            data={filteredRows}
                            selected={selected}
                            setSelected={setSelected}
                            onView={onView}
                            onApprove={onApprove}
                            onReject={onReject}
                            actionStyles={{
                                view: "ne-btn-view",
                                approve: "ne-btn-ok",
                                reject: "ne-btn-x"
                            }}
                        />
                    </div>
                </div>
            </div>

            <StudentProfileDialog
                visible={profile.visible}
                onHide={() => setProfile({ visible:false, data:null })}
                data={profile.data}
            />

            <ActionNoteDialog
                visible={approveDlg}
                title="Approve Enrollment"
                onHide={() => setApproveDlg(false)}
                onConfirm={applyBulkApprove}
                loading={submitting}
                mode="approve"
            />
            <ActionNoteDialog
                visible={rejectDlg}
                title="Reject Enrollment"
                onHide={() => setRejectDlg(false)}
                onConfirm={applyBulkReject}
                loading={submitting}
                mode="reject"
            />
        </div>
    );
}
