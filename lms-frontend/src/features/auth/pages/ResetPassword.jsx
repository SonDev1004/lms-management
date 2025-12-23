import {useMemo, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {InputText} from "primereact/inputtext";
import {Panel} from "primereact/panel";
import {Toast} from "primereact/toast";

import bg from "assets/images/bg-login.png";
import authApi from "@/features/auth/api/authApi.js";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = useMemo(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get("token") || "";
    }, [location.search]);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.current?.show({
                severity: "error", summary: "Invalid link", detail: "Missing reset token.", life: 4000,
            });
            return;
        }

        if (!newPassword || !confirmPassword) {
            toast.current?.show({
                severity: "warn", summary: "Invalid", detail: "Please enter new password and confirm it.", life: 3500,
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.current?.show({
                severity: "warn", summary: "Invalid", detail: "Confirm password does not match.", life: 3500,
            });
            return;
        }

        try {
            setSubmitting(true);
            await authApi.resetPassword({token, newPassword, confirmPassword});

            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Password reset successful. Redirecting to login...",
                life: 2500,
            });

            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || "Reset password failed.",
                life: 4500,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (<div
        style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Toast ref={toast}/>
        <div className="w-full md:w-8 lg:w-4 mx-auto">
            <Panel header="Reset Password">
                <form onSubmit={handleSubmit}>
                    {!token && (<div className="mb-3" style={{color: "crimson"}}>
                        Invalid reset link (missing token).
                    </div>)}

                    <div className="p-inputgroup">
                        <InputText
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={submitting}
                        />
                        <Button
                            type="button"
                            icon={showNewPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                            severity="secondary"
                            outlined
                            onClick={() => setShowNewPassword((v) => !v)}
                            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                            disabled={submitting}
                        />
                    </div>

                    <div className="p-inputgroup">
                        <InputText
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={submitting}
                        />
                        <Button
                            type="button"
                            icon={showConfirmPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                            severity="secondary"
                            outlined
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            disabled={submitting}
                        />
                    </div>


                    <div className="flex flex-column gap-2 mb-3">
                        <Button
                            label="Reset password"
                            type="submit"
                            loading={submitting}
                            disabled={!token}
                        />
                    </div>

                    <Divider/>
                    <div className="flex justify-content-between">
                        <Link to="/login">Back to Login</Link>
                        <Link to="/forgot-password">Resend reset email</Link>
                    </div>
                </form>
            </Panel>
        </div>
    </div>);
}
