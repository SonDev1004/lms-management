import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";

import "../styles/tokens.css";
import "../styles/account-page.css";
import "../styles/inputs.css";

import { useAccounts } from "../hooks/useAccounts";
import FiltersBar from "../components/FiltersBar";
import AccountsTable from "../components/AccountsTable";
import EditAccountDialog from "../components/EditAccountDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import AccountDetailsDialog from "../components/AccountDetailsDialog";

export default function AccountManagementPage(){
    const toast = useRef(null);
    const {
        items, total,  page, rows, setPage,
        filters, actions, options
    } = useAccounts();

    const [viewing, setViewing]   = useState(null);
    const [editing, setEditing]   = useState(null);
    const [confirm, setConfirm]   = useState({ open:false, user:null });

    const applyFilters = () => {
        toast.current?.show({ severity:"info", summary:"Filters applied", life:1200 });
    };

    const handleSave = (form) => {
        actions.updateAccount(form.id, { name:form.name, role:form.role, status:form.status });
        setEditing(null);
        toast.current?.show({ severity:"success", summary:"Success", detail:"Account updated successfully", life:1800 });
    };

    const handleToggle = (u) => {
        const next = u.status === "Active" ? "Inactive" : "Active";
        actions.updateAccount(u.id, { status: next });
        toast.current?.show({ severity:"success", summary:"Success", detail:`Account ${next.toLowerCase()} successfully`, life:2000 });
    };

    const handleResetPwd = (u) => setConfirm({ open:true, user:u });

    const confirmYes = () => {
        const u = confirm.user;
        actions.resetPassword(u.id);
        setConfirm({ open:false, user:null });
        toast.current?.show({ severity:"success", summary:"Success", detail:"Password reset email sent", life:2000 });
    };

    return (
        <div className="am-wrap">
            <Toast ref={toast}/>
            <div className="am-container">
                <div style={{marginBottom:14}}>
                    <div className="am-title">Account Management</div>
                    <div className="am-sub">Manage user accounts, roles, and permissions for your LMS platform</div>
                </div>

                <FiltersBar
                    total={total}
                    roles={options.roles}
                    statuses={options.statuses}
                    query={filters.query} setQuery={filters.setQuery}
                    role={filters.role} setRole={filters.setRole}
                    status={filters.status} setStatus={filters.setStatus}
                    from={filters.from} setFrom={filters.setFrom}
                    to={filters.to} setTo={filters.setTo}
                    sortBy={filters.sortBy} setSortBy={filters.setSortBy}
                    onReset={filters.resetFilters}
                    onApply={applyFilters}
                />

                <AccountsTable
                    items={items}
                    page={page}
                    rows={rows}
                    total={total}
                    onPage={(p)=>setPage(Math.max(1, Math.min(p, Math.ceil(total/rows))))}
                    onView={(u)=>setViewing(u)}
                    onEdit={(u)=>setEditing(u)}
                    onToggleStatus={handleToggle}
                    onResetPwd={handleResetPwd}
                />

                <AccountDetailsDialog
                    visible={!!viewing}
                    value={viewing}
                    onHide={()=>setViewing(null)}
                    onEdit={()=>{ setEditing(viewing); setViewing(null); }}
                />

                <EditAccountDialog
                    visible={!!editing}
                    value={editing}
                    onHide={()=>setEditing(null)}
                    onSave={handleSave}
                    roleOptions={options.roles}
                    statusOptions={options.statuses}
                />

                <ConfirmDialog
                    visible={confirm.open}
                    title="Confirm Password Reset"
                    message={`Are you sure you want to reset the password for ${confirm.user?.name}? A new password will be sent to their email.`}
                    onNo={()=>setConfirm({ open:false, user:null })}
                    onYes={confirmYes}
                />
            </div>
        </div>
    );
}
