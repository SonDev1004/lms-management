import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import "../styles/filters.css";

export default function FiltersBar({
                                       total,
                                       roles, statuses,
                                       query, setQuery,
                                       role, setRole,
                                       status, setStatus,
                                       from, setFrom,
                                       to, setTo,
                                       sortBy, setSortBy,
                                       onApply, onReset
                                   }) {
    return (
        <div className="am-card am-p-20">
            <div className="filters">
                {/* Hàng 1 */}
                <div className="field item item--search">
                    <span className="label">Search</span>
                    <InputText
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="field item item--roles">
                    <span className="label">Roles</span>
                    <Dropdown
                        value={role}
                        onChange={(e) => setRole(e.value)}
                        options={roles}
                        placeholder="Select roles..."
                        showClear
                    />
                </div>

                <div className="field item item--status">
                    <span className="label">Status</span>
                    <Dropdown
                        value={status}
                        onChange={(e) => setStatus(e.value)}
                        options={statuses}
                        placeholder="Select status..."
                        showClear
                    />
                </div>

                <div className="field item item--sort">
                    <span className="label">Sort By</span>
                    <Dropdown
                        value={sortBy}
                        onChange={(e) => setSortBy(e.value)}
                        options={["Created Date", "Name", "Email"]}
                    />
                </div>

                <div className="field item item--dates">
                    <span className="label">Created Date Range</span>
                    <div className="dates-grid">
                        <Calendar
                            value={from}
                            onChange={(e) => setFrom(e.value)}
                            placeholder="From"
                            showIcon
                        />
                        <Calendar
                            value={to}
                            onChange={(e) => setTo(e.value)}
                            placeholder="To date"
                            showIcon
                        />
                    </div>
                </div>
            </div>

            <div className="filters-row2">
                <div className="left-info">{total} results found</div>
                <div className="actions">
                    <Button
                        className="p-button-outlined ghost"
                        label="Reset Filters"
                        onClick={onReset}
                        icon="pi pi-refresh"
                    />
                    <Button
                        className="apply"
                        label="Apply Filters"
                        onClick={onApply}
                        icon="pi pi-filter-fill"
                    />
                </div>
            </div>
        </div>
    );
}
