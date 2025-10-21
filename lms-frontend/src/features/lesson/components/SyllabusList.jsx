import React from "react";
import "../style/SyllabusList.css";

export default function SyllabusList({
    course,
    syllabusData = [],
    onOpenDetail,
    onOpenDoc,
    openFirstDoc = true,
}) {
    const completed = Math.max(0, (course?.lessonsCompleted ?? 0) - 1);

    const handleOpen = (item) => {
        if (openFirstDoc && Array.isArray(item.documents) && item.documents.length > 0) {
            onOpenDoc?.(item, item.documents[0]);
        } else {
            onOpenDetail?.(item);
        }
    };

    const handleKeyOpen = (e, item) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen(item);
        }
    };

    return (
        <div className="syllabus-list p-grid p-align-start" role="list" aria-label="Syllabus week list">
            {syllabusData.map((item, idx) => {
                const key = item?.id ?? item?.code ?? idx;
                const isCurrent = idx === Math.max(0, Math.min(syllabusData.length - 1, completed));

                return (
                    <div key={key} className="p-col-12 p-md-6 p-lg-4">
                        <article
                            role="listitem"
                            className={`syllabus-card p-shadow-1 ${isCurrent ? "current" : ""}`}
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyOpen(e, item)}
                            aria-current={isCurrent ? "true" : "false"}
                        >
                            <header
                                className="syllabus-card-main p-d-flex p-jc-between p-ai-center"
                                role="button"
                                onClick={() => handleOpen(item)}
                                aria-label={`Open details for week ${item?.title ?? ""}`}
                            >
                                <div className="p-d-flex p-ai-center p-flex-1" style={{ gap: 12 }}>
                                    <div className="syllabus-title">{item?.title}</div>
                                </div>

                                <div className="syllabus-actions p-d-flex p-ai-center">
                                    {/* chừa chỗ cho nút action nếu cần */}
                                </div>
                            </header>

                            <section className="syllabus-body p-p-2">
                                <div className="syllabus-desc small-muted">
                                    {item?.desc && item.desc.length > 0
                                        ? item.desc
                                        : "Click the title to view a window with description, objectives, and materials."}
                                </div>

                                {Array.isArray(item?.documents) && item.documents.length > 0 && (
                                    <div className="syllabus-docs p-mt-3 p-d-flex p-flex-wrap" aria-label={`Documents for week ${item.title}`}>
                                        {item.documents.map((doc, i) => (
                                            <button
                                                key={doc?.id ?? i}
                                                type="button"
                                                className="doc-card p-button p-mr-2 p-mb-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenDoc?.(item, doc);
                                                }}
                                            >
                                                <span className="doc-icon" aria-hidden>
                                                    📄
                                                </span>
                                                <span className="doc-text">{doc?.name ?? `Document ${i + 1}`}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </article>
                    </div>
                );
            })}
        </div>
    );
}
