import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";

export default function ActorSelect({
                                        value, onChange, options = [], className = "", placeholder = "All actors"
                                    }) {
    const opts = options.length
        ? options
        : [
            { label: "All actors", value: null },
            { label: "System", value: "system" },
            { label: "Admin IT", value: "adminit" },
            { label: "Teacher", value: "teacher" },
            { label: "Student", value: "student" }
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

ActorSelect.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
    className: PropTypes.string,
    placeholder: PropTypes.string
};
