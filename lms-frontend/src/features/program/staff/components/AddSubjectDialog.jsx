import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import "../styles/dialog-forms.css";

import { getSubjectsPSPage } from "@/features/program/api/programService.js";

export default function AddSubjectDialog({
                                             visible,
                                             onClose,
                                             programs = [],
                                             defaultProgramId = null,
                                             onSave,
                                         }) {
    const firstRef = useRef(null);

    const programOptions = useMemo(() => {
        return (programs || []).map((p) => ({
            label: `${p.title ?? p.name ?? "(no title)"} (${p.code ?? p.id})`,
            value: p.id,
        }));
    }, [programs]);

    const [programId, setProgramId] = useState(defaultProgramId ?? null);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [picked, setPicked] = useState({}); // { [id]: true }

    useEffect(() => {
        if (!visible) return;
        setProgramId(defaultProgramId ?? programOptions[0]?.value ?? null);
        setKeyword("");
        setPicked({});
        const t = setTimeout(() => firstRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [visible, defaultProgramId, programOptions]);

    useEffect(() => {
        let alive = true;
        if (!visible) return;

        (async () => {
            setLoading(true);
            try {
                // load nhiều một chút để chọn
                const res = await getSubjectsPSPage({ page0: 0, size: 200, keyword: keyword?.trim() || undefined, pageBase: 1 });
                if (!alive) return;
                setSubjects(res.items || []);
            } finally {
                alive && setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [visible, keyword]);

    const canSave = !!programId && Object.values(picked).some(Boolean);

    const toggle = (id) => {
        setPicked((m) => ({ ...m, [id]: !m[id] }));
    };

    const selectedIds = useMemo(() => {
        return Object.entries(picked)
            .filter(([, v]) => v)
            .map(([k]) => Number(k));
    }, [picked]);

    const handleSave = () => {
        if (!canSave) return;
        onSave?.({ programId, subjectIds: selectedIds });
    };

    return (
        <Dialog
            header="Assign Subjects to Program"
            visible={visible}
            modal
            className="dlg"
            style={{ width: 760, maxWidth: "96vw" }}
            breakpoints={{ "1200px": "760px", "768px": "96vw" }}
            onHide={onClose}
            blockScroll
        >
            <div className="dlg-scroll">
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Target</h4>
                    <div className="frm-grid">
                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Program <span className="req">*</span></label>
                            <Dropdown
                                value={programId}
                                options={programOptions}
                                onChange={(e) => setProgramId(e.value)}
                                placeholder="Select program"
                                showClear
                                className={!programId ? "p-invalid" : ""}
                            />
                            {!programId && <div className="error">Chọn một chương trình.</div>}
                        </div>
                    </div>
                </section>

                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Pick subjects</h4>

                    <div className="frm-grid">
                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Search</label>
                            <InputText
                                ref={firstRef}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search subject by title/code..."
                            />
                            <div className="hint">
                                Tick subjects you want to assign to the selected program.
                            </div>
                        </div>
                    </div>

                    <div style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 12,
                        maxHeight: 360,
                        overflow: "auto",
                        opacity: loading ? 0.7 : 1,
                    }}>
                        {subjects?.length ? (
                            subjects.map((s) => (
                                <div
                                    key={s.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "8px 6px",
                                        borderBottom: "1px solid #f1f5f9",
                                    }}
                                >
                                    <Checkbox
                                        inputId={`sj-${s.id}`}
                                        checked={!!picked[s.id]}
                                        onChange={() => toggle(s.id)}
                                    />
                                    <label htmlFor={`sj-${s.id}`} style={{ cursor: "pointer", flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>
                                            {s.title} <span style={{ fontWeight: 400, opacity: 0.7 }}>({s.code || s.id})</span>
                                        </div>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                                            Sessions: {s.sessionNumber ?? 0} • Fee: {(s.fee ?? 0).toLocaleString("vi-VN")}₫ • {s.isActive ? "active" : "inactive"}
                                        </div>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: 10, opacity: 0.7 }}>
                                {loading ? "Loading..." : "No subjects found."}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="dlg-footer">
                <div style={{ marginRight: "auto", opacity: 0.8 }}>
                    Selected: {selectedIds.length}
                </div>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                <Button label="Assign" icon="pi pi-check" onClick={handleSave} disabled={!canSave} />
            </div>
        </Dialog>
    );
}
