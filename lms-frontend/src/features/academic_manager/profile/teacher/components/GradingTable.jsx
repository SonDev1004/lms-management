import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

const statusChip = (s) => {
    const map = { completed: 'success', inprogress: 'info', overdue: 'danger' };
    return <Tag value={s} severity={map[s] || 'info'} rounded />;
};

export default function GradingTable({ items }) {
    return (
        <DataTable value={items} showGridlines rowClassName={(r)=> ({ 'row-soft-left-danger': r.status==='overdue' })} emptyMessage="No grading tasks.">
            <Column field="course" header="Course" sortable />
            <Column field="assessment" header="Assessment" />
            <Column field="due" header="Due" sortable />
            <Column header="Submitted" body={(r) => `${r.submitted}/${r.total}`} />
            <Column header="Status" body={(r) => statusChip(r.status)} />
            <Column field="avg" header="Avg" body={(r)=> (r.avg ?? '—')} />
        </DataTable>
    );
}
