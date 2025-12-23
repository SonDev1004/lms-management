import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";

import bg from "assets/images/bg-login.png";
import authApi from "@/features/auth/api/authApi.js";

export default function ForgotPassword() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const toast = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = String(emailOrUsername || "").trim();
        if (!v) {
            toast.current?.show({
                severity: "warn",
                summary: "Invalid",
                detail: "Please enter your email or username.",
                life: 3000,
            });
            return;
        }

        try {
            setSubmitting(true);
            await authApi.forgotPassword(v);

            // Không leak account tồn tại hay không
            toast.current?.show({
                severity: "success",
                summary: "Request sent",
                detail: "If the account exists, a reset email has been sent.",
                life: 4500,
            });
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.response?.data?.message || "Failed to send reset email.",
                life: 4500,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Toast ref={toast} />
            <div className="w-full md:w-8 lg:w-4 mx-auto">
                <Panel header="Forgot Password">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-2 mb-3">
                            <label htmlFor="emailOrUsername">Email or Username</label>
                            <InputText
                                id="emailOrUsername"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                placeholder="Enter email or username"
                                disabled={submitting}
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-column gap-2 mb-3">
                            <Button
                                label="Send reset email"
                                type="submit"
                                loading={submitting}
                            />
                        </div>

                        <Divider />
                        <div className="flex justify-content-between">
                            <Link to="/login">Back to Login</Link>
                            <Link to="/register">Register Now</Link>
                        </div>
                    </form>
                </Panel>
            </div>
        </div>
    );
}
