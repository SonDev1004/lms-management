import React from "react";
import { Dialog } from "primereact/dialog";

function formatDate(d) {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt)) return d;
    const day = String(dt.getDate()).padStart(2, "0");
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
}
function splitContent(text) {
    if (!text) return [];
    const parts = text.split(/[\n,·;]+/).map((s) => s.trim()).filter(Boolean);
    return parts.length <= 3 ? parts : parts.slice(0, 3);
}
function DocPreview({ doc }) {
    if (!doc) return null;
    if (doc.type === "pdf") {
        return <iframe title={doc.name} src={doc.url} style={{ width: "100%", height: "60vh", border: "none" }} />;
    }
    if (doc.type === "image") {
        return <div style={{ textAlign: "center" }}><img src={doc.url} alt={doc.name} style={{ maxWidth: "100%", maxHeight: "60vh" }} /></div>;
    }
    if (doc.type === "audio") {
        return <div style={{ padding: 8 }}><p>{doc.name}</p><audio controls src={doc.url} style={{ width: "100%" }} /></div>;
    }
    return (
        <div style={{ padding: 8 }}>
            <p>Không hỗ trợ xem trực tiếp định dạng này.</p>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.download}>Tải xuống</a>
        </div>
    );
}

export default function SyllabusDialog({ value, visible, onHide, onOpenDoc }) {
    const item = value;
    return (
        <Dialog
            header={item?.title || "Chi tiết tuần"}
            visible={visible}
            className="syllabus-modal"
            style={{ width: "80vw", maxWidth: 1100 }}
            modal
            onHide={onHide}
            breakpoints={{ "960px": "95vw" }}
        >
            {item ? (
                <div className="syllabus-modal-grid">
                    <div>
                        <div className="syllabus-modal-header">
                            <h3 className="syllabus-modal-title">{item.title}</h3>
                            <div className="syllabus-modal-sub">
                                <div className="syllabus-shortdesc">{item.desc}</div>
                                <div style={{ marginLeft: 6, color: "#94a3b8" }}>
                                    📅 {formatDate(item.publishedAt)} {item.updatedAt ? `• Cập nhật ${formatDate(item.updatedAt)}` : ""}
                                </div>
                            </div>
                        </div>

                        <ul className="syllabus-bullets">
                            {splitContent(item.content).map((x, i) => <li key={i}>{x}</li>)}
                        </ul>

                        <div className="syllabus-detail">
                            <div className="syllabus-docs">
                                {item.activeDoc ? (
                                    <div className="doc-preview"><DocPreview doc={item.activeDoc} /></div>
                                ) : (
                                    <div className="syllabus-docs">
                                        {(item.documents ?? []).map((doc) => (
                                            <div key={doc.id} className="doc-card" onClick={() => onOpenDoc?.(item, doc)}>
                                                <div className="doc-icon" aria-hidden>
                                                    {doc.type === "pdf" ? "📄" : doc.type === "image" ? "🖼️" : "🔉"}
                                                </div>
                                                <div className="doc-text">{doc.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="syllabus-quickinfo">
                        <div className="qi-row"><div className="qi-label">Chủ đề</div><div className="qi-value">{item.subject}</div></div>
                        <div className="qi-row"><div className="qi-label">GV</div><div className="qi-value">{item.teacher}</div></div>
                        <div className="qi-row"><div className="qi-label">Phát hành</div><div className="qi-value">{formatDate(item.publishedAt)}</div></div>
                        {item.updatedAt && (
                            <div className="qi-row"><div className="qi-label">Cập nhật</div><div className="qi-value">{formatDate(item.updatedAt)}</div></div>
                        )}
                    </aside>
                </div>
            ) : <p>Không có dữ liệu.</p>}
        </Dialog>
    );
}
