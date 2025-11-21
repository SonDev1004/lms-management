import { Dropdown } from "primereact/dropdown";

export default function UserRoleField({
                                          label,
                                          required,
                                          value,
                                          options,
                                          onChange,
                                      }) {
    return (
        <div className="eaf-field">
            <label className="eaf-label">
                {label}
                {required && <span className="eaf-required">*</span>}
            </label>
            <Dropdown
                value={value}
                options={options}
                onChange={(e) => onChange(e.value)}
                className="eaf-dropdown"
                placeholder="Select role"
            />
        </div>
    );
}
