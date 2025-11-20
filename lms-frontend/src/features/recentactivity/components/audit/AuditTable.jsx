import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionBadge from "./ActionBadge";
import IpCell from "./IpCell";
import { formatDateTime } from "../../utils/fmt";

export default function AuditTable({ rows, lastUpdated }) {
    const header = (
        <div className="audit-meta">
            <i className="pi pi-calendar" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
    );

    const timestampTpl = (row) => {
        const { date, time } = formatDateTime(row.timestamp);
        const [month, day, year] = date.split(" ");
        return (
            <div>
                <div style={{fontWeight:700}}>{`${month} ${day}, ${year}`}</div>
                <div style={{color:"#64748b"}}>{time}</div>
            </div>
        );
    };

    const actionTpl = (row) => <ActionBadge action={row.action} />;
    const ipTpl = (row) => <IpCell ip={row.ip} />;

    return (
        <Card className="table-card">
            <DataTable value={rows} scrollable scrollHeight="flex" size="small" header={header}
                       emptyMessage="No audit events found">
                <Column header="Timestamp" body={timestampTpl} style={{minWidth:200}} />
                <Column field="actor" header="Actor" style={{minWidth:160}} />
                <Column header="Action" body={actionTpl} style={{minWidth:180}} />
                <Column field="resource" header="Resource" style={{minWidth:220}} />
                <Column field="details" header="Details" style={{minWidth:320}} />
                <Column header="IP Address" body={ipTpl} style={{minWidth:160}} />
            </DataTable>
        </Card>
    );
}
