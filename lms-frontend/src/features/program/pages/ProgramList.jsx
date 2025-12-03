import { useEffect, useMemo, useState } from "react";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getListProgram } from "@/features/program/api/programService";
import ProgramCard from "@/features/home/component/ProgramCard";
import "../styles/ourprogram.css";

export default function ProgramList() {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingQ, setPendingQ] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(9);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const { items } = await getListProgram({ page: 1, size: 999 });
            setAllItems(items || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            setQuery(pendingQ.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [pendingQ]);

    const filtered = useMemo(() => {
        if (!query) return allItems;
        const kw = query.toLowerCase();
        return allItems.filter((p) =>
            [p.title, p.code, p.description].some((t) =>
                (t || "").toLowerCase().includes(kw)
            )
        );
    }, [allItems, query]);

    const total = filtered.length;

    const pagedItems = useMemo(() => {
        const start = (page - 1) * rows;
        return filtered.slice(start, start + rows);
    }, [filtered, page, rows]);

    const onPageChange = (e) => {
        const newPage = Math.floor(e.first / e.rows) + 1;
        setPage(newPage);
        setRows(e.rows);
    };

    return (
        <div className="ourp-wrap">
            <div className="ourp-head">
                <h1 className="ourp-title">Our Programs</h1>

                <div className="ourp-right">
                    <div className="ourp-searchbar">
            <span className="p-input-icon-left ourp-input">
              <i className="pi pi-search" />
              <InputText
                  value={pendingQ}
                  onChange={(e) => setPendingQ(e.target.value)}
                  placeholder="Search by name / code / description…"
                  className="w-full"
                  aria-label="Search programs"
              />
            </span>

                        {pendingQ && (
                            <Button
                                type="button"
                                icon="pi pi-times"
                                outlined
                                severity="secondary"
                                onClick={() => setPendingQ("")}
                                aria-label="Clear search"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ===== List ===== */}
            {loading && <p className="text-center text-600">Đang tải…</p>}
            {!loading && total === 0 && (
                <p className="text-center text-600">Không có chương trình nào</p>
            )}

            {!loading && total > 0 && (
                <div className="program-card">
                    <div className="grid">
                        {pagedItems.map((p) => (
                            <div key={p.id} className="col-12 md:col-6 lg:col-4">
                                <div className="pg-cell">
                                    <ProgramCard program={p} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== Paginator ===== */}
            <Paginator
                className="ourp-paginator"
                first={(page - 1) * rows}
                rows={rows}
                totalRecords={total}
                onPageChange={onPageChange}
            />
        </div>
    );
}
