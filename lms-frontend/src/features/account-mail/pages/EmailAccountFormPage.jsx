import { useRef } from "react";
import { Toast } from "primereact/toast";
import EmailAccountForm from "../components/EmailAccountForm";
import "../styles/email-account-form.css";

export default function EmailAccountFormPage() {
    const toast = useRef(null);

    const handleSubmit = (values) => {
        // TODO: call API tạo tài khoản + gửi mail
        console.log("Submit form values: ", values);

        toast.current?.show({
            severity: "success",
            summary: "Email sent",
            detail: "Account information has been sent successfully.",
        });
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
                    <EmailAccountForm onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
