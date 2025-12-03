import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import EmailAccountForm from "../components/EmailAccountForm";
import "../styles/email-account-form.css";

import { createUserAccount } from "../api/adminItService";

export default function EmailAccountFormPage() {
    const toast = useRef(null);

    const [formVersion, setFormVersion] = useState(0);

    const handleSubmit = async (values) => {
        try {
            const payload = {
                userName: values.username,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                roleId: values.roleId,
            };

            const createdUser = await createUserAccount(payload);

            toast.current?.show({
                severity: "success",
                summary: "Account created",
                detail: createdUser
                    ? `Account "${createdUser.userName}" created and email sent.`
                    : "Account has been created and email has been sent.",
            });

            // 👇 reset form: remount EmailAccountForm
            setFormVersion((v) => v + 1);
        } catch (error) {
            const detail =
                error?.response?.data?.message ||
                "Failed to create account or send email.";

            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail,
            });
        }
    };

    return (
        <div className="eaf-page">
            <Toast ref={toast} />
            <div className="eaf-card">
                <div className="eaf-card-header">
                    <h2 className="eaf-title">Email Composition Form</h2>
                    <p className="eaf-subtitle">
                        Enter user information to send account credentials.
                    </p>
                </div>

                <div className="eaf-card-body">
                    <EmailAccountForm key={formVersion} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
