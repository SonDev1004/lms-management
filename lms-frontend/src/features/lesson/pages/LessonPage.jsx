import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import lessonService from "@/features/lesson/api/lessonService.js";
import SyllabusList from "@/features/lesson/components/SyllabusList.jsx";
import SyllabusDialog from "@/features/lesson/components/SyllabusDialog.jsx";

export default function LessonPage() {
    const { courseId } = useParams();
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get("subjectId");

    const [syllabusData, setSyllabusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    // Pagination (server-side, 0-based)
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [hasMore, setHasMore] = useState(false);

    // reset trang khi đổi subject
    useEffect(() => { setPage(0); }, [subjectId]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                if (!subjectId) { setLoading(false); return; }
                setLoading(true);
                const items = await lessonService.getBySubject(Number(subjectId), { page, size });
                if (!ignore) {
                    setSyllabusData(Array.isArray(items) ? items : []);
                    setHasMore(Array.isArray(items) && items.length === size);
                }
            } catch (e) {
                if (!ignore) setError(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, [subjectId, page, size]);

    const onPageChange = (e) => {
        setPage(e.page);     // 0-based
        setSize(e.rows);
    };

    const openDetail = (item) => { setSelected(item); setVisible(true); };
    const openDoc = (item, doc) => { setSelected({ ...item, activeDoc: doc }); setVisible(true); };
    const onHide = () => { setVisible(false); setSelected(null); };

    if (!subjectId) return <div>Thiếu subjectId trên URL.</div>;
    if (error) return <div>Lỗi tải bài học: {String(error?.message || error)}</div>;

    const course = {
        id: courseId || "c1",
        title: "IELTS Intermediate",
        lessonsCompleted: 7,
        totalLessons: 10,
    };

    const totalRecords = (page + (hasMore ? 2 : 1)) * size;
    const first = page * size;

    return (
        <>
            {loading && <div className="small-muted">Đang tải trang {page + 1}…</div>}

            <SyllabusList course={course} syllabusData={syllabusData} onOpenDetail={openDetail} />

            <Paginator
                first={first}
                rows={size}
                totalRecords={totalRecords}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={onPageChange}
                template="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="Trang {currentPage} / {totalPages}"
            />

            <SyllabusDialog value={selected} visible={visible} onHide={onHide} onOpenDoc={openDoc} />
        </>
    );
}
