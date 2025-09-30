import React, { useEffect, useMemo, useRef, useState } from "react";
import SummaryPills from "../components/SummaryPills.jsx";
import ProgramsTable from "../components/ProgramsTable.jsx";
import useStaffProgramList from "../hooks/useStaffProgramList.js";
import "../styles/Index.css";
import "../styles/AddProgramDialog.css";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

export default function ProgramList() {
    const toast = useRef(null);
    const { stats, programs, selected, setSelected, loading, query, setQuery, filters, setFilters } =
        useStaffProgramList();

    const [localPrograms, setLocalPrograms] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newProgram, setNewProgram] = useState({
        name: "",
        category: "Adults",
        level: "A2–B1",
        durationWeeks: 12,
        fee: 0,
        totalCourses: 0,
        activeCourses: 0,
        status: "active",
    });

    const [searchText, setSearchText] = useState(query);
    useEffect(() => setSearchText(query), [query]);
    useEffect(() => {
        const t = setTimeout(() => setQuery(searchText), 350);
        return () => clearTimeout(t);
    }, [searchText, setQuery]);

    useEffect(() => setLocalPrograms(programs), [programs]);

    const categoryOptions = useMemo(
        () => [
            { label: "All Categories", value: null },
            { label: "Adults", value: "Adults" },
            { label: "Kids & Teens", value: "Kids & Teens" },
            { label: "Exam Prep", value: "Exam Prep" },
        ],
        []
    );
    const levelOptions = useMemo(
        () => [
            { label: "All Levels", value: null },
            { label: "Pre A1–A1", value: "Pre A1–A1" },
            { label: "A1–A2", value: "A1–A2" },
            { label: "A2–B1", value: "A2–B1" },
            { label: "B1–B2", value: "B1–B2" },
            { label: "B2–C1", value: "B2–C1" },
        ],
        []
    );
    const statusOptions = useMemo(
        () => [
            { label: "All Status", value: null },
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
        ],
        []
    );

    const filteredPrograms = useMemo(() => {
        const { category, level, status } = filters;
        const q = (query || "").trim().toLowerCase();
        return localPrograms.filter((p) => {
            if (
                q &&
                !(
                    (p.name || "").toLowerCase().includes(q) ||
                    String(p.id || "").toLowerCase().includes(q) ||
                    (p.category || "").toLowerCase().includes(q) ||
                    (p.level || "").toLowerCase().includes(q)
                )
            )
                return false;
            if (category && p.category !== category) return false;
            if (level && p.level !== level) return false;
            if (status && p.status !== status) return false;
            return true;
        });
    }, [localPrograms, query, filters]);

    function handleAddOpen() {
        setNewProgram({
            name: "",
            category: "Adults",
            level: "A2–B1",
            durationWeeks: 12,
            fee: 0,
            totalCourses: 0,
            activeCourses: 0,
            status: "active",
        });
        setShowAdd(true);
    }

    const canSave =
        newProgram.name && newProgram.name.trim().length >= 3 &&
        newProgram.durationWeeks >= 0 && newProgram.fee >= 0 &&
        newProgram.totalCourses >= 0 && newProgram.activeCourses >= 0 &&
        newProgram.activeCourses <= newProgram.totalCourses;

    function handleAddSave() {
        if (!canSave) {
            toast.current.show({
                severity: "warn",
                summary: "Validation",
                detail:
                    !newProgram.name || newProgram.name.trim().length < 3
                        ? "Program name must be at least 3 characters."
                        : newProgram.activeCourses > newProgram.totalCourses
                            ? "Active courses cannot exceed total courses."
                            : "Please check the fields.",
            });
            return;
        }
        const newId = `PROG${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
        const payload = { id: newId, updatedAt: new Date().toISOString().slice(0, 10), ...newProgram };
        setLocalPrograms((prev) => [payload, ...prev]);
        setSelected([]);
        setShowAdd(false);
        toast.current.show({ severity: "success", summary: "Added", detail: `Program ${payload.name} added` });
    }

    function handleDeleteSelected() {
        if (!selected?.length) {
            toast.current.show({ severity: "info", summary: "No selection", detail: "Please select at least one program." });
            return;
        }
        const ids = new Set(selected.map((x) => x.id));
        setLocalPrograms((prev) => prev.filter((x) => !ids.has(x.id)));
        setSelected([]);
        toast.current.show({ severity: "success", summary: "Deleted", detail: `${ids.size} programs removed` });
    }

    const clearAllFilters = () => setFilters({ category: null, level: null, status: null });

    return (
        <div className="dashboard-root" style={{ gap: 16 }}>
            <Toast ref={toast} />
            <div style={{ flex: 1 }}>
                <SummaryPills stats={stats} entity="programs" />

                <div className="p-card p-p-3 header-row sticky">
                    <div className="toolbar-left">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                  placeholder="Search by program, ID, category, level…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 360 }}
              />
            </span>

                        <Dropdown
                            value={filters.category}
                            onChange={(e) => setFilters((f) => ({ ...f, category: e.value }))}
                            options={categoryOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Categories"
                            style={{ width: 170 }}
                            showClear
                        />
                        <Dropdown
                            value={filters.level}
                            onChange={(e) => setFilters((f) => ({ ...f, level: e.value }))}
                            options={levelOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Levels"
                            style={{ width: 160 }}
                            showClear
                        />
                        <Dropdown
                            value={filters.status}
                            onChange={(e) => setFilters((f) => ({ ...f, status: e.value }))}
                            options={statusOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="All Status"
                            style={{ width: 140 }}
                            showClear
                        />
                    </div>

                    <div className="toolbar-right">
                        <Button label="Import" icon="pi pi-upload" className="p-button-outlined" />
                        <Button
                            label="Export"
                            icon="pi pi-download"
                            className="p-button-outlined"
                            onClick={() => toast.current.show({ severity: "info", summary: "Export", detail: "Export is mocked" })}
                        />
                        <Button label="+ Add Program" icon="pi pi-plus" className="p-button-success" onClick={handleAddOpen} />
                    </div>
                </div>

                {(filters.category || filters.level || filters.status) && (
                    <div className="chips-row">
                        {filters.category && <span className="chip">Category: {filters.category}</span>}
                        {filters.level && <span className="chip">Level: {filters.level}</span>}
                        {filters.status && <span className="chip">Status: {filters.status}</span>}
                        <Button label="Clear filters" className="p-button-text" onClick={clearAllFilters} />
                    </div>
                )}

                {selected?.length > 0 && (
                    <div className="p-card p-p-3 action-container">
                        <div className="action-left">
                            <div>
                                <strong>{selected.length}</strong> programs selected
                            </div>
                            <Button
                                label="Select All"
                                icon="pi pi-check-square"
                                className="p-button-text"
                                onClick={() => setSelected([...filteredPrograms])}
                            />
                            <Button label="Clear" icon="pi pi-times" className="p-button-text" onClick={() => setSelected([])} />
                        </div>

                        <div className="action-right">
                            <Button
                                label="Activate"
                                icon="pi pi-check"
                                className="p-button-outlined"
                                onClick={() =>
                                    toast.current.show({ severity: "success", summary: "Activate", detail: "Activated selected (mock)" })
                                }
                            />
                            <Button
                                label="Deactivate"
                                icon="pi pi-ban"
                                className="p-button-outlined"
                                onClick={() =>
                                    toast.current.show({ severity: "success", summary: "Deactivate", detail: "Deactivated selected (mock)" })
                                }
                            />
                            <Button
                                label="Export Selected"
                                icon="pi pi-download"
                                className="p-button-outlined"
                                onClick={() => toast.current.show({ severity: "info", summary: "Export", detail: "Export selected (mock)" })}
                            />
                            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDeleteSelected} />
                        </div>
                    </div>
                )}

                <ProgramsTable
                    programs={filteredPrograms}
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value || [])}
                    loading={loading}
                />

                {/* Add Program dialog – polished */}
                <Dialog
                    header="Add Program"
                    visible={showAdd}
                    modal
                    className="add-program-dialog"
                    style={{ width: 560 }}
                    onHide={() => setShowAdd(false)}
                >
                    <p className="apd-desc">Create a new study program. You can edit details later.</p>

                    {/* Basics */}
                    <h4 className="apd-subhead">Basics</h4>
                    <div className="apd-grid">
                        <div className="apd-field">
                            <label>Program name <span className="apd-req">*</span></label>
                            <InputText
                                value={newProgram.name}
                                onChange={(e) => setNewProgram((p) => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. IELTS Intensive (12 weeks)"
                            />
                        </div>
                        <div className="apd-field">
                            <label>Category</label>
                            <Dropdown
                                value={newProgram.category}
                                options={categoryOptions.slice(1)}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setNewProgram((p) => ({ ...p, category: e.value }))}
                            />
                        </div>
                        <div className="apd-field">
                            <label>Status</label>
                            <Dropdown
                                value={newProgram.status}
                                options={[
                                    { label: "active", value: "active" },
                                    { label: "inactive", value: "inactive" },
                                ]}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setNewProgram((p) => ({ ...p, status: e.value }))}
                            />
                        </div>
                        <div className="apd-field">
                            <label>Level (CEFR)</label>
                            <Dropdown
                                value={newProgram.level}
                                options={levelOptions.slice(1)}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setNewProgram((p) => ({ ...p, level: e.value }))}
                            />
                        </div>
                    </div>

                    {/* Duration & Cost */}
                    <h4 className="apd-subhead">Duration & Cost</h4>
                    <div className="apd-grid">
                        <div className="apd-field">
                            <label>Duration (weeks)</label>
                            <InputNumber
                                value={newProgram.durationWeeks}
                                onValueChange={(e) => setNewProgram((p) => ({ ...p, durationWeeks: e.value ?? 0 }))}
                                showButtons min={0}
                            />
                        </div>
                        <div className="apd-field">
                            <label>Tuition (VND)</label>
                            <InputNumber
                                value={newProgram.fee}
                                onValueChange={(e) => setNewProgram((p) => ({ ...p, fee: e.value ?? 0 }))}
                                mode="currency" currency="VND" locale="vi-VN"
                            />
                            <div className="apd-hint">Học phí toàn khóa, chưa gồm tài liệu.</div>
                        </div>
                    </div>

                    {/* Courses */}
                    <h4 className="apd-subhead">Courses</h4>
                    <div className="apd-grid">
                        <div className="apd-field">
                            <label>Total courses</label>
                            <InputNumber
                                value={newProgram.totalCourses}
                                onValueChange={(e) => setNewProgram((p) => ({ ...p, totalCourses: e.value ?? 0 }))}
                                showButtons min={0}
                            />
                        </div>
                        <div className="apd-field">
                            <label>Active courses</label>
                            <InputNumber
                                value={newProgram.activeCourses}
                                onValueChange={(e) => setNewProgram((p) => ({ ...p, activeCourses: e.value ?? 0 }))}
                                showButtons min={0}
                            />
                        </div>
                    </div>

                    <div className="dialog-actions">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowAdd(false)} />
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            className="p-button-primary"
                            onClick={handleAddSave}
                            disabled={!canSave}
                        />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
