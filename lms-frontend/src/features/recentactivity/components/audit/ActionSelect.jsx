import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";

export default function ActionSelect({
                                         value, onChange, options = [], className = "", placeholder = "All actions"
                                     }) {
    const opts = options.length
        ? options
        : [
            { label: "All actions", value: null },
            { label: "Login", value: "login" },
            { label: "Create", value: "create" },
            { label: "Update", value: "update" },
            { label: "Delete", value: "delete" }
        ];

    return (
        <Dropdown
            className={className}
            value={value}
            onChange={(e) => onChange?.(e.value)}
            options={opts}
            optionLabel="label"
            optionValue="value"
            placeholder={placeholder}
            panelClassName="audit-dd-panel"
            showClear={false}
        />
    );
}

ActionSelect.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
    className: PropTypes.string,
    placeholder: PropTypes.string
};
