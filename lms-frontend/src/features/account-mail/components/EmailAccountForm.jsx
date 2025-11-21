import { useState, useMemo } from "react";
import { Button } from "primereact/button";
import EmailFieldRow from "./EmailFieldRow";
import UserRoleField from "./UserRoleField";

export default function EmailAccountForm({ onSubmit }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        roleId: null,
    });

    const roleOptions = useMemo(
        () => [
            { label: "Admin-IT", value: 1 },
            { label: "Academic Manager", value: 2 },
            { label: "Teacher", value: 3 },
            { label: "Student", value: 4 },
        ],
        []
    );

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    return (
        <form className="eaf-form" onSubmit={handleSubmit}>
            <EmailFieldRow
                label="Username"
                required
                placeholder="Enter username"
                value={form.username}
                onChange={(value) => handleChange("username", value)}
            />

            <EmailFieldRow
                label="Email Address"
                required
                placeholder="Enter email address"
                value={form.email}
                onChange={(value) => handleChange("email", value)}
            />

            <EmailFieldRow
                label="First Name"
                required
                placeholder="Enter first name"
                value={form.firstName}
                onChange={(value) => handleChange("firstName", value)}
            />

            <EmailFieldRow
                label="Last Name"
                required
                placeholder="Enter last name"
                value={form.lastName}
                onChange={(value) => handleChange("lastName", value)}
            />

            <UserRoleField
                label="User Role"
                required
                value={form.roleId}
                options={roleOptions}
                onChange={(value) => handleChange("roleId", value)}
            />

            <div className="eaf-actions">
                <Button
                    type="submit"
                    label="Send Email"
                    className="p-button-raised eaf-submit-btn"
                />
            </div>
        </form>
    );
}
