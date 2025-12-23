import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import userAdminService from "../api/userAdminService.js";
import UserDialog from "../components/UserDialog.jsx";

function fullName(u) {
    const fn = (u?.firstName ?? "").trim();
    const ln = (u?.lastName ?? "").trim();
    return `${fn} ${ln}`.trim() || u?.userName || `#${u?.id ?? ""}`;
}

export default function UserManagement({ role, title }) {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const [roles, setRoles] = useState([]);
    const [dlgOpen, setDlgOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // load roles
    useEffect(() => {
        (async () => {
            try {
                const list = await userAdminService.getRoles();
                setRoles(list);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    // load users (debounce 250ms)
    useEffect(() => {
        let alive = true;
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const list = await userAdminService.getUsers({ role, keyword: q });
                console.log("[UserManagement] received =", Array.isArray(list), list?.length);
                if (alive) setRows(Array.isArray(list) ? list : []);

            } catch (e) {
                console.error(e);
                if (alive) {
                    setRows([]);
                    toast.current?.show({
                        severity: "error",
                        summary: "Load failed",
                        detail: e?.response?.data?.message || e?.message || "Cannot load users",
                    });
                }
            } finally {
                if (alive) setLoading(false);
            }
        }, 250);

        return () => {
            alive = false;
            clearTimeout(t);
        };
    }, [role, q]);

    const data = useMemo(() => rows, [rows]);

    const userCell = (row) => {
        const name = fullName(row);
        return (
            <div className="flex align-items-center gap-2">
                <Avatar label={name.slice(0, 1).toUpperCase()} size="large" shape="circle" />
                <div className="flex flex-column">
                    <span className="font-medium">{name}</span>
                    <span className="text-500">{row.email}</span>
                </div>
            </div>
        );
    };

    const roleCell = (row) => row?.role?.name ?? row?.roleName ?? "";

    const statusCell = (row) => (
        <span className={`status-pill ${row?.isActive ? "ok" : "off"}`}>
      {row?.isActive ? "Active" : "Inactive"}
    </span>
    );

    const actionsCell = (row) => (
        <div className="flex align-items-center gap-2">
            <Button
                icon="pi pi-eye"
                rounded
                text
                onClick={() => navigate(`./${row.id}`)}
            />
            <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                onClick={() => {
                    setEditing(row);
                    setDlgOpen(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                onClick={() =>
                    confirmDialog({
                        header: "Delete user",
                        message: `Remove ${fullName(row)}?`,
                        icon: "pi pi-exclamation-triangle",
                        acceptClassName: "p-button-danger",
                        accept: async () => {
                            try {
                                await userAdminService.deleteUser(row.id);
                                toast.current?.show({
                                    severity: "success",
                                    summary: "Deleted",
                                    detail: "User removed",
                                });
                                const list = await userAdminService.getUsers({ role, keyword: q });
                                setRows(list);
                            } catch (e) {
                                toast.current?.show({
                                    severity: "error",
                                    summary: "Delete failed",
                                    detail: e?.response?.data?.message || e?.message || "Cannot delete",
                                });
                            }
                        },
                    })
                }
            />
        </div>
    );

    async function onSave(form) {
        try {
            if (editing?.id) {
                await userAdminService.updateUser(editing.id, {
                    userName: form.userName,
                    email: form.email,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    isActive: form.isActive,
                    roleId: form.roleId || null,
                });
                toast.current?.show({ severity: "success", summary: "Updated", detail: "Saved" });
            } else {
                // nếu page được fix theo role, auto set roleId theo role đó
                let roleId = form.roleId;
                if (!roleId && role) {
                    const r = roles.find((x) => String(x.name).toUpperCase() === String(role).toUpperCase());
                    roleId = r?.id;
                }
                await userAdminService.createUser({
                    userName: form.userName,
                    email: form.email,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    roleId,
                });
                toast.current?.show({ severity: "success", summary: "Created", detail: "Added" });
            }

            setDlgOpen(false);
            setEditing(null);

            const list = await userAdminService.getUsers({ role, keyword: q });
            setRows(list);
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Save failed",
                detail: e?.response?.data?.message || e?.message || "Cannot save",
            });
        }
    }

    return (
        <div className="page-wrap">
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />

            <div className="header-row">
                <div>
                    <h1 className="title">{title}</h1>
                    <div className="subtitle">Manage accounts {role ? `(role: ${role})` : ""}</div>
                </div>

                <Button
                    label="Add"
                    icon="pi pi-plus"
                    className="p-button-lg"
                    onClick={() => {
                        setEditing(null);
                        setDlgOpen(true);
                    }}
                />
            </div>

            <div className="card search-card">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
              className="w-full"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search username/email/name..."
          />
        </span>
            </div>

            <div className="card">
                <div className="section-title">Total: {Array.isArray(data) ? data.length : 0}</div>


                <DataTable
                    value={data}
                    loading={loading}
                    paginator
                    rows={10}
                    stripedRows
                    responsiveLayout="scroll"
                >
                    <Column header="User" body={userCell} />
                    <Column field="userName" header="Username" />
                    <Column header="Role" body={roleCell} />
                    <Column header="Status" body={statusCell} />
                    <Column header="Actions" body={actionsCell} style={{ width: "10rem" }} />
                </DataTable>
            </div>

            {dlgOpen && (
                <UserDialog
                    visible={dlgOpen}
                    onHide={() => {
                        setDlgOpen(false);
                        setEditing(null);
                    }}
                    roles={roles}
                    defaultValues={editing}
                    lockRole={!!role}
                    fixedRole={role}
                    onSave={onSave}
                />
            )}
        </div>
    );
}
