import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
import { fetchLeaveRequestsForStudent, submitLeaveRequest } from "../api/leaveService";
import "../style/LeaveRequestForm.css";

const leaveTypes = [
    { label: "Sick", value: "sick" },
    { label: "Personal", value: "personal" },
    { label: "Family emergency", value: "family_emergency" },
    { label: "School activity", value: "school_activity" },
    { label: "Official exam", value: "exam" },
    { label: "Late arrival / Leave early", value: "partial" },
    { label: "Other", value: "other" }
];

const STATUS_OPTIONS = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" }
];

const DATE_MODE_OPTIONS = [
    { label: "Select by range", value: "range" },
    { label: "Select multiple days", value: "multiple" }
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" }
];

const PAGE_SIZE = 5;

export default function LeaveRequestForm({
                                             visible,
                                             onHide,
                                             course,
                                             student,
                                             sessions = [],
                                             onSubmitted,
                                             inline = true
                                         }) {
    const [sessionId, setSessionId] = useState(null);
    const [range, setRange] = useState(null);
    const [dateMode, setDateMode] = useState("range");
    const [types, setTypes] = useState([]);
    const [reason, setReason] = useState("");
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [highlightId, setHighlightId] = useState(null);

    const [statusFilter, setStatusFilter] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest");

    const toast = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!student?.id) return;
        setLoadingRequests(true);
        fetchLeaveRequestsForStudent(student.id)
            .then((list) => {
                const sorted = (list || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRequests(sorted);
            })
            .catch((e) => {
                console.error(e);
                toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load the list." });
            })
            .finally(() => setLoadingRequests(false));
    }, [student?.id]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        if (!inline && !visible) resetForm();
    }, [inline, visible]);

    const resetForm = () => {
        setSessionId(null);
        setRange(null);
        setTypes([]);
        setReason("");
        setFiles([]);
        setSubmitting(false);
        setEditingId(null);
    };

    const formatSize = (bytes = 0) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const validate = () => {
        if (!types || types.length === 0) {
            toast.current?.show({ severity: "warn", summary: "Missing information", detail: "Please select at least one leave type." });
            return false;
        }
        const hasDateOrSession = sessionId || (Array.isArray(range) && range.length > 0);
        if (!hasDateOrSession) {
            toast.current?.show({ severity: "warn", summary: "Missing information", detail: "Please select a session or a date." });
            return false;
        }
        if (!reason || reason.trim().length < 5) {
            toast.current?.show({ severity: "warn", summary: "Missing information", detail: "Please provide a reason (at least 5 characters)." });
            return false;
        }
        return true;
    };

    const onUploadSelect = (e) => {
        const incoming = Object.values(e.files).map((f) => ({
            file: f,
            name: f.name,
            size: f.size,
            preview: null,
            progress: 0
        }));

        incoming.forEach((entry) => {
            const f = entry.file;
            if (f && f.type && f.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setFiles((prev) => [...prev, { ...entry, preview: ev.target.result }]);
                };
                reader.readAsDataURL(f);
            } else {
                setFiles((prev) => [...prev, entry]);
            }
        });
    };

    const removeFile = (name) => {
        setFiles((prev) => prev.filter((p) => p.name !== name));
    };

    const simulateUploadAll = (filesToUpload) => {
        const uploads = filesToUpload.map((f) => {
            return new Promise((resolve) => {
                const totalMs = 700 + Math.floor(Math.random() * 800);
                const steps = 20;
                let step = 0;
                const interval = setInterval(() => {
                    step++;
                    const progress = Math.min(100, Math.round((step / steps) * 100));
                    setFiles((prev) => prev.map((p) => (p.name === f.name ? { ...p, progress } : p)));
                    if (progress >= 100) {
                        clearInterval(interval);
                        resolve({ name: f.name, size: f.size, url: "", uploadedAt: new Date().toISOString() });
                    }
                }, Math.max(20, Math.round(totalMs / steps)));
            });
        });
        return Promise.all(uploads);
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            const attachments = files.length > 0 ? await simulateUploadAll(files) : [];
            const payload = {
                studentId: student?.id || null,
                courseId: course?.id || null,
                sessionId: sessionId || null,
                range: Array.isArray(range) ? range : null,
                type: types,
                reason,
                attachments
            };
            const res = await submitLeaveRequest(payload);
            if (editingId) {
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === editingId
                            ? { ...r, type: res.type || types, reason: res.reason || reason, createdAt: r.createdAt, status: r.status }
                            : r
                    )
                );
                toast.current?.show({ severity: "success", summary: "Updated", detail: "Request has been updated." });
                setHighlightId(editingId);
            } else {
                setRequests((prev) => [{ ...res, status: "pending", type: types }, ...prev]);
                setHighlightId(res.id);
                toast.current?.show({ severity: "success", summary: "Submitted", detail: "Leave request has been submitted." });
            }
            setTimeout(() => setHighlightId(null), 3000);
            onSubmitted?.(res);
            resetForm();
            setPage(1);
        } catch (err) {
            console.error(err);
            toast.current?.show({ severity: "error", summary: "Error", detail: "Unable to submit the request." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditRequest = (r) => {
        if (!r || r.status !== "pending") return;
        setEditingId(r.id);
        setTypes(Array.isArray(r.type) ? r.type : r.type ? [r.type] : []);
        setReason(r.reason);
        setSessionId(r.sessionId || null);
        setRange(r.range || null);
        const top = document.querySelector(".leave-inline")?.getBoundingClientRect().top || 0;
        window.scrollTo({ top: window.scrollY + top - 40, behavior: "smooth" });
    };

    const handleRemoveRequest = (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        setRequests((prev) => prev.filter((r) => r.id !== id));
        toast.current?.show({ severity: "info", summary: "Deleted", detail: `Request ${id} has been deleted.` });
    };

    let filtered = requests.filter((r) => {
        if (Array.isArray(statusFilter) && statusFilter.length > 0 && !statusFilter.includes(r.status)) return false;
        if (!debouncedSearch) return true;
        const s = debouncedSearch;
        return (
            (r.reason || "").toLowerCase().includes(s) ||
            (Array.isArray(r.type) ? r.type.join(" ").toLowerCase() : (r.type || "").toLowerCase()).includes(s) ||
            (r.id || "").toLowerCase().includes(s)
        );
    });

    filtered = filtered.slice().sort((a, b) => {
        if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

    function getIconByName(name = "") {
        const ext = name.split(".").pop()?.toLowerCase();
        if (!ext) return <i className="pi pi-file" />;
        if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return <i className="pi pi-image" />;
        if (["pdf"].includes(ext)) return <i className="pi pi-file-pdf" />;
        if (["doc", "docx"].includes(ext)) return <i className="pi pi-file-word" />;
        if (["xls", "xlsx"].includes(ext)) return <i className="pi pi-file-excel" />;
        return <i className="pi pi-file" />;
    }

    function formatShortDateForList(d) {
        if (!d) return "";
        const dt = new Date(d);
        const dd = String(dt.getDate()).padStart(2, "0");
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const yy = dt.getFullYear();
        const hh = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");
        return `${dd}/${mm}/${yy}, ${hh}:${min}`;
    }

    function capitalize(s = "") {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const formContent = (
        <div className="lr-form-grid">
            <div className="p-field lr-field-type">
                <label htmlFor="lr-type">Type</label>
                <MultiSelect
                    id="lr-type"
                    value={types}
                    options={leaveTypes}
                    onChange={(e) => setTypes(e.value || [])}
                    placeholder="Select leave type"
                    display="chip"
                    showClear
                />
            </div>

            <div className="p-field lr-field-session">
                <label htmlFor="lr-session">Select session (if applicable)</label>
                <Dropdown
                    id="lr-session"
                    value={sessionId}
                    options={sessions.map((s) => ({
                        label: `${s.title} — ${new Date(s.date).toLocaleDateString()}`,
                        value: s.id
                    }))}
                    onChange={(e) => setSessionId(e.value)}
                    placeholder="Select session"
                    showClear
                />
            </div>

            <div className="p-field lr-field-datemode">
                <label htmlFor="lr-datemode">Date selection mode</label>
                <Dropdown
                    id="lr-datemode"
                    value={dateMode}
                    options={DATE_MODE_OPTIONS}
                    onChange={(e) => {
                        setDateMode(e.value);
                        setRange(null);
                    }}
                />
            </div>

            <div className="p-field lr-field-range">
                <label htmlFor="lr-range">Or select date</label>
                <Calendar
                    id="lr-range"
                    value={range}
                    onChange={(e) => setRange(e.value)}
                    selectionMode={dateMode}
                    readOnlyInput
                    placeholder={
                        dateMode === "range"
                            ? "Select date range (e.g. 12/08/2025 - 14/08/2025)"
                            : "Select multiple dates (click multiple times)"
                    }
                    dateFormat="dd/mm/yy"
                />
                <small className="lr-help">
                    {dateMode === "range" ? "Select two dates to create a range." : "Select individual dates."}
                </small>
            </div>

            <div className="p-field lr-field-reason">
                <label htmlFor="lr-reason">Reason</label>
                <InputTextarea
                    id="lr-reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter detailed reason"
                />
            </div>

            <div className="p-field lr-field-docs">
                <label>Documents (optional)</label>
                <FileUpload
                    name="attachments"
                    customUpload
                    uploadHandler={() => {}}
                    multiple
                    maxFileSize={10000000}
                    onSelect={onUploadSelect}
                    onClear={() => setFiles([])}
                    chooseLabel="Choose"
                    cancelLabel="Cancel"
                    uploadLabel="Upload"
                    className="lr-fileupload"
                />

                {files.length > 0 && (
                    <div className="lr-file-list">
                        {files.map((f) => (
                            <div key={f.name} className="lr-file-item">
                                <div className="lr-file-left">
                                    {f.preview ? (
                                        <img src={f.preview} alt={f.name} className="lr-thumb" />
                                    ) : (
                                        <div className="lr-file-icon">{getIconByName(f.name)}</div>
                                    )}
                                    <div className="lr-file-meta">
                                        <div className="lr-file-name">{f.name}</div>
                                        <div className="lr-file-size">{formatSize(f.size)}</div>
                                    </div>
                                </div>

                                <div className="lr-file-right">
                                    {f.progress > 0 && f.progress < 100 && (
                                        <ProgressBar value={f.progress} showValue={false} style={{ width: 140 }} />
                                    )}
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-text p-button-sm lr-file-remove"
                                        onClick={() => removeFile(f.name)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-field lr-actions">
                <Button label="Reset" className="p-button-text" onClick={resetForm} disabled={submitting} />
                <Button
                    label={editingId ? "Save changes" : "Submit"}
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={submitting}
                />
            </div>
        </div>
    );

    const requestsListTop = (
        <div className="lr-requests-top">
            <div className="lr-requests-controls">
                <div className="lr-requests-header">
                    <strong>Request List</strong>
                    <span className="lr-requests-sub"> ({requests.length})</span>
                </div>

                <div className="lr-filters">
                    <div className="lr-filter-status">
                        <label className="sr-only">Filter by status</label>
                        <MultiSelect
                            value={statusFilter}
                            options={STATUS_OPTIONS}
                            onChange={(e) => {
                                setStatusFilter(e.value || []);
                                setPage(1);
                            }}
                            placeholder="All"
                            display="chip"
                            style={{ minWidth: 220 }}
                        />
                    </div>

                    <div className="lr-search">
                        <InputText
                            placeholder="Search by reason, type, id..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="lr-sort-wrap">
                        <Dropdown value={sortOrder} options={SORT_OPTIONS} onChange={(e) => setSortOrder(e.value)} />
                    </div>
                </div>
            </div>

            <div className="lr-requests-items">
                {loadingRequests && <div className="lr-empty">Loading...</div>}
                {!loadingRequests && paged.length === 0 && <div className="lr-empty">No requests found.</div>}

                {paged.map((r) => (
                    <div key={r.id} className={`lr-request-item ${highlightId === r.id ? "lr-highlight" : ""}`}>
                        <div className="r-left">
                            <div className="r-type">
                                {Array.isArray(r.type)
                                    ? r.type.map((t) => capitalize(t)).join(" • ")
                                    : capitalize(r.type)}
                            </div>
                            <div className="r-reason">{r.reason}</div>
                        </div>

                        <div className="r-right">
                            <div className="r-meta">
                                <span className={`r-status badge-${r.status}`}>{capitalize(r.status)}</span>
                                <div className="r-date">{formatShortDateForList(r.createdAt)}</div>
                            </div>

                            <div className="r-actions">
                                {r.status === "pending" && (
                                    <>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-text p-button-sm"
                                            onClick={() => handleEditRequest(r)}
                                            aria-label={`Edit ${r.id}`}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-text p-button-sm"
                                            onClick={() => handleRemoveRequest(r.id)}
                                            aria-label={`Delete ${r.id}`}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="lr-pagination">
                    <Button icon="pi pi-angle-left" className="p-button-text" onClick={goPrev} disabled={page <= 1} />
                    <span className="lr-page-info">
                        Page {page}/{totalPages}
                    </span>
                    <Button
                        icon="pi pi-angle-right"
                        className="p-button-text"
                        onClick={goNext}
                        disabled={page >= totalPages}
                    />
                </div>
            </div>
        </div>
    );

    if (inline) {
        return (
            <div className={`leave-inline ${mounted ? "lr-enter" : ""}`}>
                <Toast ref={toast} />
                <h3 className="lr-title">Leave Request</h3>
                {requestsListTop}
                <hr className="lr-divider" />
                <div className="lr-main">{formContent}</div>
            </div>
        );
    }

    const dialogFooter = (
        <div className="lr-dialog-footer">
            <Button
                label="Cancel"
                className="p-button-text"
                onClick={() => {
                    resetForm();
                    onHide?.();
                }}
                disabled={submitting}
            />
            <Button label="Submit" onClick={handleSubmit} loading={submitting} disabled={submitting} />
        </div>
    );

    return (
        <Dialog
            header="Leave Request"
            visible={!!visible}
            style={{ width: "720px" }}
            footer={dialogFooter}
            onHide={onHide}
            closable
        >
            <Toast ref={toast} />
            <div className="lr-dialog-wrap">
                {requestsListTop}
                <hr className="lr-divider" />
                {formContent}
            </div>
        </Dialog>
    );
}
