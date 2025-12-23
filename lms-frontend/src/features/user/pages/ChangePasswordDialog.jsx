import {useEffect, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";

import authApi from "@/features/auth/api/authApi.js";

export default function ChangePasswordDialog({open, onClose}) {
    const toast = useRef(null);
    const [saving, setSaving] = useState(false);
    const [pwd, setPwd] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [show, setShow] = useState({
        old: false,
        next: false,
        confirm: false,
    });

    useEffect(() => {
        if (!open) {
            setPwd({oldPassword: "", newPassword: "", confirmPassword: ""});
            setShow({old: false, next: false, confirm: false});
            setSaving(false);
        }
    }, [open]);


    const setField = (k, v) => setPwd((s) => ({...s, [k]: v}));

    const submit = async () => {
        if (!pwd.oldPassword || !pwd.newPassword || !pwd.confirmPassword) {
            toast.current?.show({severity: "warn", summary: "Invalid", detail: "Please fill all fields.", life: 3000});
            return;
        }
        if (pwd.newPassword !== pwd.confirmPassword) {
            toast.current?.show({
                severity: "warn",
                summary: "Invalid",
                detail: "Confirm password does not match.",
                life: 3000
            });
            return;
        }
        if (pwd.newPassword === pwd.oldPassword) {
            toast.current?.show({
                severity: "warn",
                summary: "Invalid",
                detail: "New password must be different.",
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);
            await authApi.changePassword(pwd);
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Password changed successfully.",
                life: 2500
            });
            onClose?.();
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || "Change password failed.",
                life: 4500,
            });
        } finally {
            setSaving(false);
        }
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancel" outlined onClick={onClose} disabled={saving}/>
            <Button label="Change password" icon="pi pi-save" onClick={submit} loading={saving}/>
        </div>
    );

    return (
        <>
            <Toast ref={toast}/>
            <Dialog
                header="Change Password"
                visible={open}
                style={{width: "520px", maxWidth: "92vw"}}
                onHide={onClose}
                footer={footer}
                modal
                closable={!saving}
                dismissableMask={!saving}
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label className="block mb-2">Old password</label>
                        <div className="p-inputgroup w-full">
                            <InputText
                                type={show.old ? "text" : "password"}
                                value={pwd.oldPassword}
                                onChange={(e) => setField("oldPassword", e.target.value)}
                                className="w-full"
                                disabled={saving}
                            />
                            <Button
                                type="button"
                                icon={show.old ? "pi pi-eye-slash" : "pi pi-eye"}
                                severity="secondary"
                                outlined
                                onClick={() => setShow((s) => ({...s, old: !s.old}))}
                                aria-label={show.old ? "Hide old password" : "Show old password"}
                                disabled={saving}
                            />
                        </div>

                    </div>
                    <div>
                        <label className="block mb-2">New password</label>
                        <div className="p-inputgroup w-full">
                            <InputText
                                type={show.next ? "text" : "password"}
                                value={pwd.newPassword}
                                onChange={(e) => setField("newPassword", e.target.value)}
                                className="w-full"
                                disabled={saving}
                            />
                            <Button
                                type="button"
                                icon={show.next ? "pi pi-eye-slash" : "pi pi-eye"}
                                severity="secondary"
                                outlined
                                onClick={() => setShow((s) => ({...s, next: !s.next}))}
                                aria-label={show.next ? "Hide new password" : "Show new password"}
                                disabled={saving}
                            />
                        </div>

                    </div>
                    <div>
                        <label className="block mb-2">Confirm password</label>
                        <div className="p-inputgroup w-full">
                            <InputText
                                type={show.confirm ? "text" : "password"}
                                value={pwd.confirmPassword}
                                onChange={(e) => setField("confirmPassword", e.target.value)}
                                className="w-full"
                                disabled={saving}
                            />
                            <Button
                                type="button"
                                icon={show.confirm ? "pi pi-eye-slash" : "pi pi-eye"}
                                severity="secondary"
                                outlined
                                onClick={() => setShow((s) => ({...s, confirm: !s.confirm}))}
                                aria-label={show.confirm ? "Hide confirm password" : "Show confirm password"}
                                disabled={saving}
                            />
                        </div>

                    </div>
                </div>
            </Dialog>
        </>
    );
}
