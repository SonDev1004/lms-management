import React, { useEffect, useMemo, useRef, useState } from "react";
import SummaryPills from "../components/SummaryPills.jsx";
import ProgramsTable from "../components/ProgramsTable.jsx";
import ProgramDetailDialog from "../components/ProgramDetailDialog.jsx";
import AddProgramDialog from "../components/AddProgramDialog.jsx";
import AddSubjectDialog from "../components/AddSubjectDialog.jsx";
import ProgramToolbar from "../components/ProgramToolbar.jsx";
import FilterChips from "../components/FilterChips.jsx";
import BulkActionsBar from "../components/BulkActionsBar.jsx";
import useStaffProgramList from "../hooks/useStaffProgramList.js";

import "../styles/Index.css";
import "../styles/AddProgramDialog.css";
import { Toast } from "primereact/toast";

export default function ProgramList() {
    const toast = useRef(null);
    const {
        stats, programs, selected, setSelected, loading,
        query, setQuery, filters, setFilters,
    } = useStaffProgramList();

    const [localPrograms, setLocalPrograms] = useState([]);
    useEffect(() => setLocalPrograms(programs), [programs]);

    // Search debounce
    const [searchText, setSearchText] = useState(query);
    useEffect(() => setSearchText(query), [query]);
    useEffect(() => { const t = setTimeout(() => setQuery(searchText), 350); return () => clearTimeout(t); }, [searchText, setQuery]);

    // Options
    const levelOptions = useMemo(() => [
        { label: "All Levels", value: null },
        { label: "Pre A1–A1", value: "Pre A1–A1" },
        { label: "A1–A2", value: "A1–A2" },
        { label: "A2–B1", value: "A2–B1" },
        { label: "B1–B2", value: "B1–B2" },
        { label: "B2–C1", value: "B2–C1" },
    ], []);
    const statusOptions = useMemo(() => [
        { label: "All Status", value: null },
        { label: "active", value: "active" },
        { label: "inactive", value: "inactive" },
    ], []);

    // Filter (NO category)
    const filteredPrograms = useMemo(() => {
        const { level, status } = filters;
        const q = (query || "").trim().toLowerCase();
        return localPrograms.filter((p) => {
            if (q && !((p.name || "").toLowerCase().includes(q) ||
                String(p.id || "").toLowerCase().includes(q) ||
                (p.level || "").toLowerCase().includes(q))) return false;
            if (level && p.level !== level) return false;
            if (status && p.status !== status) return false;
            return true;
        });
    }, [localPrograms, query, filters]);

    // Add Program dialog
    const [showAdd, setShowAdd] = useState(false);
    function handleAddProgramSave(payload) {
        const id = `PROG${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
        const row = { id, updatedAt: new Date().toISOString().slice(0, 10), category: "-", ...payload };
        setLocalPrograms((prev) => [row, ...prev]);
        setSelected([]);
        setShowAdd(false);
        toast.current.show({ severity: "success", summary: "Added", detail: `Program ${row.name} added` });
    }

    // Detail
    const [detail, setDetail] = useState({ visible: false, program: null });
    function openDetail(p) { setDetail({ visible: true, program: p }); }
    function handleUpdateProgram(updated) {
        setLocalPrograms((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
        toast.current.show({ severity: "success", summary: "Updated", detail: `Program "${updated.name}" updated` });
    }
    function handleDeleteProgram(idOrRow) {
        const id = typeof idOrRow === "string" ? idOrRow : idOrRow.id;
        setLocalPrograms((prev) => prev.filter((x) => x.id !== id));
        if (detail.visible && detail.program?.id === id) setDetail({ visible: false, program: null });
        toast.current.show({ severity: "success", summary: "Deleted", detail: "Program deleted" });
    }

    // Bulk
    function handleDeleteSelected() {
        if (!selected?.length) return toast.current.show({ severity: "info", summary: "No selection", detail: "Please select at least one program." });
        const ids = new Set(selected.map((x) => x.id));
        setLocalPrograms((prev) => prev.filter((x) => !ids.has(x.id)));
        setSelected([]);
        toast.current.show({ severity: "success", summary: "Deleted", detail: `${ids.size} programs removed` });
    }

    // Add Subject
    const [showAddSubject, setShowAddSubject] = useState(false);
    function handleAddSubjectSave(payload) {
        const prog = localPrograms.find((p) => p.id === payload.programId);
        toast.current.show({
            severity: "success", summary: "Subject added",
            detail: `Subject "${payload.name}" added to ${prog?.name || payload.programId} (mock)`,
        });
        setShowAddSubject(false);
    }

    return (
        <div className="dashboard-root" style={{ gap: 16 }}>
            <Toast ref={toast} />
            <div style={{ flex: 1 }}>
                <SummaryPills stats={stats} entity="programs" />

                <ProgramToolbar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    level={filters.level}
                    status={filters.status}
                    levelOptions={levelOptions}
                    statusOptions={statusOptions}
                    onLevelChange={(v) => setFilters((f) => ({ ...f, level: v }))}
                    onStatusChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                    onAddProgram={() => setShowAdd(true)}
                    onAddSubject={() => setShowAddSubject(true)}
                    onExport={() => toast.current.show({ severity: "info", summary: "Export", detail: "Export is mocked", life: 1800 })}
                    onImport={() => toast.current.show({ severity: "info", summary: "Import", detail: "Import is mocked", life: 1800 })}
                />

                <FilterChips
                    level={filters.level}
                    status={filters.status}
                    onClear={() => setFilters({ ...filters, level: null, status: null })}
                />

                <BulkActionsBar
                    count={selected?.length || 0}
                    onSelectAll={() => setSelected([...filteredPrograms])}
                    onClearSel={() => setSelected([])}
                    onActivate={() => toast.current.show({ severity: "success", summary: "Activate", detail: "Activated selected (mock)" })}
                    onDeactivate={() => toast.current.show({ severity: "success", summary: "Deactivate", detail: "Deactivated selected (mock)" })}
                    onExportSel={() => toast.current.show({ severity: "info", summary: "Export", detail: "Export selected (mock)" })}
                    onDeleteSel={handleDeleteSelected}
                />

                <ProgramsTable
                    programs={filteredPrograms}
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value || [])}
                    loading={loading}
                    onView={openDetail}
                    onEdit={openDetail}
                    onDelete={handleDeleteProgram}
                />

                <AddProgramDialog
                    visible={showAdd}
                    onClose={() => setShowAdd(false)}
                    onSave={handleAddProgramSave}
                />

                <ProgramDetailDialog
                    visible={detail.visible}
                    onClose={() => setDetail({ visible: false, program: null })}
                    program={detail.program}
                    onUpdate={handleUpdateProgram}
                    onDelete={handleDeleteProgram}
                />

                <AddSubjectDialog
                    visible={showAddSubject}
                    onClose={() => setShowAddSubject(false)}
                    programs={localPrograms}
                    onSave={handleAddSubjectSave}
                />
            </div>
        </div>
    );
}
