import React from "react";
import { Panel } from "primereact/panel";
import '../style/SyllabusList.css';
export default function SyllabusList({ course, syllabusData, onOpenDetail, onOpenDoc, openFirstDoc = true }) {
    return (
        <div className="syllabus-list p-d-flex p-flex-column p-mt-2">
            {syllabusData.map((item, idx) => {
                const isCurrent =
                    idx === Math.max(0, Math.min(syllabusData.length - 1, (course?.lessonsCompleted ?? 1) - 1));

                const handleOpen = () => {
                    if (openFirstDoc && Array.isArray(item.documents) && item.documents.length > 0) {
                        onOpenDoc?.(item, item.documents[0]);
                    } else {
                        onOpenDetail?.(item);
                    }
                };

                return (
                    <Panel
                        key={item.id}
                        className={`syllabus-card ${isCurrent ? "current" : ""}`}
                        header={
                            <div
                                className="p-d-flex p-jc-between p-ai-center syllabus-card-main"
                                role="button"
                                onClick={handleOpen}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
                                tabIndex={0}
                                style={{ cursor: "pointer" }}
                                aria-label={`Mở chi tiết tuần ${item.title}`}
                            >
                                <div className="p-d-flex p-ai-center" style={{ gap: 10 }}>
                                    <strong className="syllabus-title" style={{ fontSize: 16 }}>{item.title}</strong>
                                </div>
                                <div className="syllabus-actions p-d-flex p-ai-center" role="group" aria-label="Hành động tuần">
                                </div>
                            </div>
                        }
                    >
                        <div className="p-p-2 small-muted" style={{ fontSize: 13 }}>
                            {item.desc && item.desc.length > 0
                                ? item.desc
                                : "Nhấn vào tiêu đề để mở cửa sổ chứa mô tả, mục tiêu và tài liệu."}
                        </div>
                    </Panel>
                );
            })}
        </div>
    );
}
