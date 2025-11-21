import { InputText } from "primereact/inputtext";

export default function EmailFieldRow({
                                          label,
                                          required,
                                          value,
                                          onChange,
                                          placeholder,
                                      }) {
    return (
        <div className="eaf-field">
            <label className="eaf-label">
                {label}
                {required && <span className="eaf-required">*</span>}
            </label>
            <InputText
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="eaf-input"
            />
        </div>
    );
}
