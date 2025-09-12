import { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import { getListProgram } from "@/features/program/api/programService";
import ProgramCard from "@/features/home/component/ProgramCard";
import {getListSubject} from "@/features/subject/api/subjectService.js";
import SubjectCard from "@/features/home/component/SubjectCard.jsx";

export default function SubjectList() {
    const [items, setItems] = useState([]);
    const [paging, setPaging] = useState({ page: 1, size: 9, totalPages: 1, hasNext: false, hasPrevious: false });
    const [loading, setLoading] = useState(false);

    const fetchData = async (page = 1, size = 9) => {
        try {
            setLoading(true);
            const { items, paging } = await getListSubject({ page, size });
            setItems(items);
            setPaging(paging);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1, paging.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Paginator của PrimeReact dùng "first" (offset). Ta quy đổi ra page.
    const onPageChange = (e) => {
        const page = Math.floor(e.first / e.rows) + 1;
        fetchData(page, e.rows);
    };

    return (
        <div className="max-w-6xl mx-auto px-3 py-6">
            <h1 className="text-3xl font-bold mb-4">Môn học của trung tâm</h1>

            {loading && <p>Đang tải…</p>}

            <div className="grid">
                {items.map((p) => (
                    <div key={p.id} className="col-12 md:col-6 lg:col-4">
                        <SubjectCard subject={p} />
                    </div>
                ))}
            </div>

            <Paginator
                className="mt-4"
                first={(paging.page - 1) * paging.size}
                rows={paging.size}
                totalRecords={paging.totalItems ?? paging.size * paging.totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}
