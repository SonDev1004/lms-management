import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

import DateRangeSelect from "./DateRangeSelect";
import ActionSelect from "./ActionSelect";
import ActorSelect from "./ActorSelect";

import "../../styles/filters.css";

export default function FiltersBar({
                                       query, setQuery,
                                       dateRange, setDateRange, dateRanges = [],
                                       action, setAction, actions = [],
                                       actor, setActor, actors = [],
                                       className = ""
                                   }) {
    return (
        <Card className={`audit-filters p-card--flat audit-filters--plain ${className}`}>
            <div className="filters-head">
                <i className="pi pi-filter" />
                <h3>Filters</h3>
                <span className="filters-desc">
          Filter audit logs by action type, actor, date range, and more
        </span>
            </div>

            <div className="filters-grid">
                {/* Search */}
                <div className="field">
                    <label>Search</label>
                    <div className="search-wrap">
                        <span className="search-badge"><i className="pi pi-search" /></span>
                        <InputText
                            className="control"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search logs..."
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="field">
                    <label>Date Range</label>
                    <DateRangeSelect
                        className="control"
                        value={dateRange}
                        onChange={setDateRange}
                        options={dateRanges}
                        placeholder="Last 7 days"
                    />
                </div>

                {/* Actions */}
                <div className="field">
                    <label>Actions</label>
                    <ActionSelect
                        className="control"
                        value={action}
                        onChange={setAction}
                        options={actions}
                        placeholder="All actions"
                    />
                </div>

                {/* Actors */}
                <div className="field">
                    <label>Actors</label>
                    <ActorSelect
                        className="control"
                        value={actor}
                        onChange={setActor}
                        options={actors}
                        placeholder="All actors"
                    />
                </div>
            </div>
        </Card>
    );
}

FiltersBar.propTypes = {
    query: PropTypes.string,
    setQuery: PropTypes.func.isRequired,
    dateRange: PropTypes.any,
    setDateRange: PropTypes.func.isRequired,
    dateRanges: PropTypes.array,
    action: PropTypes.any,
    setAction: PropTypes.func.isRequired,
    actions: PropTypes.array,
    actor: PropTypes.any,
    setActor: PropTypes.func.isRequired,
    actors: PropTypes.array,
    className: PropTypes.string
};
