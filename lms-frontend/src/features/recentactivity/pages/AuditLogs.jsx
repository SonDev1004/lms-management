import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import useAuditLogs from "../hooks/useAuditLogs";
import FiltersBar from "../components/audit/FiltersBar";
import AuditTable from "../components/audit/AuditTable";
import { exportCsv } from "../utils/csv";
import "../styles/audit.css";
import '../mocks/auditEvents.mock.js';
import '../mocks/auditLogs.js';
export default function AuditLogs() {
    const { data, filters, lists, meta } = useAuditLogs();

    const handleExport = () => {
        exportCsv(
            "audit_logs.csv",
            data.map((d) => ({
                timestamp: d.timestamp,
                actor: d.actor,
                action: d.action,
                resource: d.resource,
                details: d.details,
                ip: d.ip ?? "N/A",
            }))
        );
    };

    return (
        <div className="audit-shell">
            {/* Header */}
            <Card className="card">
                <div className="audit-header">
                    <div>
                        <div className="eyebrow">Audit Logs</div>
                        <h2 className="audit-title">Audit Logs</h2>
                        <div className="audit-sub">
                            Monitor system activity and track user actions for compliance and security
                        </div>
                    </div>

                    <div className="audit-actions">
                        <Button label="Refresh" icon="pi pi-refresh" outlined onClick={meta.refresh} />
                        <Button label="Export CSV" icon="pi pi-download" outlined onClick={handleExport} />
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <FiltersBar
                query={filters.query}
                setQuery={filters.setQuery}
                dateRange={filters.dateRange}
                setDateRange={filters.setDateRange}
                dateRanges={lists.dateRanges}
                action={filters.action}
                setAction={filters.setAction}
                actions={lists.actions}
                actor={filters.actor}
                setActor={filters.setActor}
                actors={lists.actors}
            />

            {/* Meta line */}
            <div className="audit-meta">
                <i className="pi pi-list" />
                <span>Showing {data.length} of {data.length} audit events</span>
                <span style={{ marginLeft: "auto" }}>
          <i className="pi pi-calendar" style={{ marginRight: 6 }} />
          Last updated: {meta.lastUpdated.toLocaleTimeString()}
        </span>
            </div>

            {/* Table */}
            <AuditTable rows={data} lastUpdated={meta.lastUpdated} />
        </div>
    );
}
