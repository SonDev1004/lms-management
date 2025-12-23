import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export default function UserDialog({
                                       visible,
                                       onHide,
                                       roles,
                                       defaultValues,
                                       lockRole,
                                       fixedRole,
                                       onSave,
                                   }) {
    const isEdit = !!defaultValues?.id;

    const initial = useMemo(() => {
        return {
            userName: defaultValues?.userName ?? "",
            email: defaultValues?.email ?? "",
            firstName: defaultValues?.firstName ?? "",
            lastName: defaultValues?.lastName ?? "",
            isActive: defaultValues?.isActive ?? true,
            roleId: defaultValues?.role?.id ?? defaultValues?.roleId ?? null,
        };
    }, [defaultValues]);

    const [form, setForm] = useState(initial);

    useEffect(() => setForm(initial), [initial]);

    // auto apply fixedRole on create
    useEffect(() => {
        if (!isEdit && fixedRole && roles?.length) {
            const r = roles.find((x) => String(x.name).toUpperCase() === String(fixedRole).toUpperCase());
            if (r?.id) setForm((p) => ({ ...p, roleId: r.id }));
        }
    }, [isEdit, fixedRole, roles]);

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancel" outlined onClick={onHide} />
            <Button
                label={isEdit ? "Update" : "Create"}
                icon="pi pi-check"
                onClick={() => onSave(form)}
                disabled={!form.userName?.trim() || !form.email?.trim()}
            />
        </div>
    );

    return (
        <Dialog
            header={isEdit ? "Edit User" : "Add User"}
            visible={visible}
            style={{ width: "560px", maxWidth: "95vw" }}
            onHide={onHide}
            footer={footer}
            modal
        >
            <div className="grid">
                <div className="col-12">
                    <label className="block mb-2">Username</label>
                    <InputText
                        className="w-full"
                        value={form.userName}
                        onChange={(e) => setForm((p) => ({ ...p, userName: e.target.value }))}
                    />
                </div>

                <div className="col-12">
                    <label className="block mb-2">Email</label>
                    <InputText
                        className="w-full"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                </div>

                <div className="col-6">
                    <label className="block mb-2">First name</label>
                    <InputText
                        className="w-full"
                        value={form.firstName}
                        onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                </div>

                <div className="col-6">
                    <label className="block mb-2">Last name</label>
                    <InputText
                        className="w-full"
                        value={form.lastName}
                        onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                </div>

                <div className="col-12">
                    <label className="block mb-2">Role</label>
                    <Dropdown
                        className="w-full"
                        options={roles}
                        optionLabel="name"
                        optionValue="id"
                        value={form.roleId}
                        disabled={lockRole}
                        placeholder="Select role"
                        onChange={(e) => setForm((p) => ({ ...p, roleId: e.value }))}
                    />
                </div>

                {isEdit && (
                    <div className="col-12 flex align-items-center gap-2 mt-2">
                        <Checkbox
                            inputId="isActive"
                            checked={!!form.isActive}
                            onChange={(e) => setForm((p) => ({ ...p, isActive: e.checked }))}
                        />
                        <label htmlFor="isActive">Active</label>
                    </div>
                )}
            </div>
        </Dialog>
    );
}
