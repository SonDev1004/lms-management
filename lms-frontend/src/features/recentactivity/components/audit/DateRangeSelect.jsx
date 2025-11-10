import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";

export default function DateRangeSelect({
                                            value, onChange, options = [], className = "", placeholder = "Last 7 days"
                                        }) {
    const opts = options.length
        ? options
        : [
            { label: "Last 24 hours", value: "24h" },
            { label: "Last 7 days", value: "7d" },
            { label: "Last 30 days", value: "30d" },
            { label: "This month", value: "mtd" },
            { label: "Custom range…", value: "custom" }
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

DateRangeSelect.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
    className: PropTypes.string,
    placeholder: PropTypes.string
};
