import React, {useEffect, useMemo, useRef, useState} from "react";
import SummaryPills from "../components/SummaryPills.jsx";
import ProgramsTable from "../components/ProgramsTable.jsx";
import ProgramDetailDialog from "../components/ProgramDetailDialog.jsx";
import AddProgramDialog from "../components/AddProgramDialog.jsx";
import AddSubjectDialog from "../components/AddSubjectDialog.jsx";
import ProgramToolbar from "../components/ProgramToolbar.jsx";
import BulkActionsBar from "../components/BulkActionsBar.jsx";
import useStaffProgramList from "../hooks/useStaffProgramList.js";

import "../styles/Index.css";
import "../styles/AddProgramDialog.css";
import {Toast} from "primereact/toast";

import {
    createProgramPS,
    assignSubjectsToProgramPS,
    getDetailProgram,
} from "@/features/program/api/programService.js";
import {createSubject, getSubjectsPage} from "@/features/subject/api/subjectService.js";
import SubjectsTable from "../components/SubjectsTable.jsx";
import SubjectDetailDialog from "../components/SubjectDetailDialog.jsx";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {TabPanel, TabView} from "primereact/tabview";
import CreateSubjectDialog from "../components/CreateSubjectDialog.jsx";

export default function ProgramList() {
    const toast = useRef(null);

    const {
        stats,
        programs,
        selected,
        setSelected,
        loading,
        keyword,
        setKeyword,
        isActive,
        setIsActive,
        // nếu hook có paging thì lấy thêm:
        page0,
        setPage0,
        size,
        setSize,
        totalItems,
    } = useStaffProgramList();

    // Search debounce
    const [searchText, setSearchText] = useState(keyword ?? "");

    // ===== Subjects tab state =====
    const [subLoading, setSubLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subPage0, setSubPage0] = useState(0);
    const [subSize, setSubSize] = useState(10);
    const [subTotal, setSubTotal] = useState(0);

    const [subSearch, setSubSearch] = useState("");
    const [subKeyword, setSubKeyword] = useState("");
    const [subjectDetailId, setSubjectDetailId] = useState(null);
    const [showSubjectDetail, setShowSubjectDetail] = useState(false);
    const [showCreateSubject, setShowCreateSubject] = useState(false);

    function openSubjectDetail(row) {
        if (!row?.id) return;
        setSubjectDetailId(row.id);
        setShowSubjectDetail(true);
    }

    useEffect(() => {
        const t = setTimeout(() => setSubKeyword(subSearch), 350);
        return () => clearTimeout(t);
    }, [subSearch]);

    const [subIsActive, setSubIsActive] = useState(null); // null=all, true, false

    const subjectStatusOptions = useMemo(
        () => [
            {label: "All Status", value: null},
            {label: "active", value: true},
            {label: "inactive", value: false},
        ],
        []
    );

    async function loadSubjects(next = {}) {
        const p0 = next.page0 ?? subPage0;
        const sz = next.size ?? subSize;

        setSubLoading(true);
        try {
            const res = await getSubjectsPage({
                page0: p0,
                size: sz,
                keyword: subKeyword || undefined,
                isActive: subIsActive,
                pageBase: 1,
            });

            setSubjects(res.items || []);
            setSubTotal(res.paging?.totalItems ?? 0);
            setSubPage0(p0);
            setSubSize(sz);
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Load subjects failed",
                detail: e?.response?.data?.message || "Cannot load subjects",
            });
        } finally {
            setSubLoading(false);
        }
    }

    useEffect(() => {
        loadSubjects({page0: 0});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subKeyword, subIsActive]);


    // Status options theo DB (boolean/null)
    const statusOptions = useMemo(
        () => [
            {label: "All Status", value: null},
            {label: "active", value: true},
            {label: "inactive", value: false},
        ],
        []
    );

    // Add Program
    const [showAdd, setShowAdd] = useState(false);

    async function handleAddProgramSave(payload) {
        try {
            await createProgramPS(payload);
            setShowAdd(false);
            setSelected([]);
            toast.current?.show({
                severity: "success",
                summary: "Added",
                detail: `Program "${payload.title}" created`,
            });

            // reload list: trigger by re-setting keyword (or hook expose refresh())
            setKeyword((k) => `${k}`);
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Create failed",
                detail: e?.response?.data?.message || "Cannot create program",
            });
        }
    }

    // Detail
    const [detail, setDetail] = useState({
        visible: false,
        program: null,
        loading: false,
    });

    async function openDetail(p) {
        if (!p?.id) return;
        setDetail({visible: true, program: null, loading: true});

        const d = await getDetailProgram(p.id);
        if (!d) {
            setDetail({visible: true, program: null, loading: false});
            toast.current?.show({severity: "warn", summary: "No detail", detail: "Cannot load program detail"});
            return;
        }

        setDetail({
            visible: true,
            loading: false,
            program: d,
        });
    }


    // Add Subject (assign)
    const [showAddSubject, setShowAddSubject] = useState(false);

    async function handleAssignSubjects({programId, subjectIds}) {
        try {
            await assignSubjectsToProgramPS(programId, subjectIds);
            toast.current?.show({
                severity: "success",
                summary: "Assigned",
                detail: `Assigned ${subjectIds.length} subject(s) to program ${programId}`,
            });
            setShowAddSubject(false);
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Assign failed",
                detail: e?.response?.data?.message || "Cannot assign subjects",
            });
        }
    }

    // Bulk actions (chưa có API delete/activate -> warn)
    function handleDeleteSelected() {
        if (!selected?.length) {
            toast.current?.show({
                severity: "info",
                summary: "No selection",
                detail: "Please select at least one program.",
            });
            return;
        }
        toast.current?.show({
            severity: "warn",
            summary: "Not supported",
            detail: "Delete programs API is not implemented yet.",
        });
    }

    return (
        <div className="dashboard-root" style={{gap: 16}}>
            <Toast ref={toast}/>

            <div style={{flex: 1}}>
                <TabView>
                    {/* ===== Programs tab: GIỮ NGUYÊN code bạn gửi ===== */}
                    <TabPanel header="Programs">
                        <SummaryPills stats={stats} entity="programs"/>

                        <ProgramToolbar
                            searchText={searchText}
                            setSearchText={setSearchText}
                            status={isActive}
                            statusOptions={statusOptions}
                            onStatusChange={(v) => setIsActive(v)}
                            onAddProgram={() => setShowAdd(true)}
                            onAddSubject={() => setShowAddSubject(true)}
                            onExport={() =>
                                toast.current?.show({
                                    severity: "info",
                                    summary: "Export",
                                    detail: "Export is mocked",
                                    life: 1800,
                                })
                            }
                            onImport={() =>
                                toast.current?.show({
                                    severity: "info",
                                    summary: "Import",
                                    detail: "Import is mocked",
                                    life: 1800,
                                })
                            }
                        />

                        <BulkActionsBar
                            count={selected?.length || 0}
                            onSelectAll={() => setSelected([...programs])}
                            onClearSel={() => setSelected([])}
                            onActivate={() =>
                                toast.current?.show({
                                    severity: "warn",
                                    summary: "Not supported",
                                    detail: "Activate API not implemented yet.",
                                })
                            }
                            onDeactivate={() =>
                                toast.current?.show({
                                    severity: "warn",
                                    summary: "Not supported",
                                    detail: "Deactivate API not implemented yet.",
                                })
                            }
                            onExportSel={() =>
                                toast.current?.show({
                                    severity: "info",
                                    summary: "Export",
                                    detail: "Export selected (mock)",
                                })
                            }
                            onDeleteSel={handleDeleteSelected}
                        />

                        <ProgramsTable
                            programs={programs}
                            selection={selected}
                            onSelectionChange={(e) => setSelected(e.value || [])}
                            loading={loading}
                            onView={openDetail}
                            onEdit={openDetail}
                            onDelete={() =>
                                toast.current?.show({
                                    severity: "warn",
                                    summary: "Not supported",
                                    detail: "Delete API not implemented yet.",
                                })
                            }
                            page={page0}
                            size={size}
                            total={totalItems}
                            onPageChange={({page, size}) => {
                                setPage0?.(page);
                                setSize?.(size);
                            }}
                        />

                        <AddProgramDialog visible={showAdd} onClose={() => setShowAdd(false)}
                                          onSave={handleAddProgramSave}/>

                        <ProgramDetailDialog
                            visible={detail.visible}
                            onClose={() => setDetail({visible: false, program: null, loading: false})}
                            program={detail.program}
                            readOnly
                        />

                        <AddSubjectDialog
                            visible={showAddSubject}
                            onClose={() => setShowAddSubject(false)}
                            programs={programs}
                            onSave={handleAssignSubjects}
                        />
                    </TabPanel>

                    {/* ===== Subjects tab: NEW ===== */}
                    <TabPanel header="Subjects">
                        <div style={{ display: "grid", gap: 12 }}>
                            <div className="p-card" style={{ padding: 14 }}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span className="p-input-icon-left" style={{ flex: 1, minWidth: 260 }}>
          <i className="pi pi-search" />
          <InputText
              placeholder="Search subject by title/code..."
              value={subSearch}
              onChange={(e) => setSubSearch(e.target.value)}
              style={{ width: "100%" }}
          />
        </span>

                                    <Dropdown
                                        value={subIsActive}
                                        options={subjectStatusOptions}
                                        onChange={(e) => setSubIsActive(e.value)}
                                        placeholder="All Status"
                                        style={{ minWidth: 180 }}
                                    />
                                </div>
                            </div>

                            <SubjectsTable
                                subjects={subjects}
                                loading={subLoading}
                                page0={subPage0}
                                size={subSize}
                                totalItems={subTotal}
                                onPageChange={({ page0, size }) => loadSubjects({ page0, size })}
                                onView={(row) => openSubjectDetail(row)}
                                onCreate={() => setShowCreateSubject(true)}
                            />

                            <SubjectDetailDialog
                                visible={showSubjectDetail}
                                onClose={() => setShowSubjectDetail(false)}
                                subjectId={subjectDetailId}
                            />
                            <CreateSubjectDialog
                                visible={showCreateSubject}
                                onClose={() => setShowCreateSubject(false)}
                                onSave={async (payload) => {
                                    try {
                                        await createSubject(payload);
                                        toast.current?.show({
                                            severity: "success",
                                            summary: "Created",
                                            detail: `Subject "${payload.title}" created`,
                                        });
                                        setShowCreateSubject(false);
                                        loadSubjects({ page0: 0 }); // reload list
                                    } catch (e) {
                                        toast.current?.show({
                                            severity: "error",
                                            summary: "Create failed",
                                            detail: e?.response?.data?.message || "Cannot create subject",
                                        });
                                    }
                                }}
                            />

                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}
