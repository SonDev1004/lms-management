import React, {useEffect, useMemo, useRef, useState} from "react";
import "@/features/tuitionrevenue/styles/filterbar.css";
const pad2 = (n) => String(n).padStart(2, "0");
const fmtMy = (y, m) => `${pad2(m)}/${y}`;
const parseMy = (s = "") => {
    const [mm, yyyy] = (s || "").split("/");
    const now = new Date();
    const y = +yyyy || now.getFullYear();
    const m = +mm || (now.getMonth() + 1);
    return { y, m };
};

export default function MonthPicker({value, onChange, disabled}) {
    const {y:initY, m:initM} = parseMy(value);
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(initY);
    const [month, setMonth] = useState(initM);
    const wrapRef = useRef(null);

    // đóng popup khi click ra ngoài
    useEffect(() => {
        const onDoc = (e) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // sync khi value prop đổi từ bên ngoài
    useEffect(() => {
        const {y, m} = parseMy(value);
        setYear(y);
        setMonth(m);
    }, [value]);

    const months = useMemo(
        () => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        []
    );

    const commit = (y, m) => {
        onChange && onChange(fmtMy(y, m));   // luôn trả về "MM/YYYY"
        setOpen(false);
    };

    // TEXT HIỂN THỊ RA NÚT
    const display = fmtMy(year, month);      // luôn có dạng "MM/YYYY"

    return (
        <div className="mp-wrap" ref={wrapRef} style={{position:"relative"}}>
            <button
                type="button"
                className={`mp-input ${disabled ? "is-disabled" : ""}`}
                onClick={() => !disabled && setOpen(o => !o)}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <span className="mp-ico" aria-hidden>📅</span>
                <span className="mp-text">{display}</span>
            </button>

            {open && (
                <div className="mp-pop card" role="dialog">
                    <div className="mp-head">
                        <button className="btn sm" onClick={() => setYear(y => y - 1)}>‹</button>
                        <div className="mp-year">{year}</div>
                        <button className="btn sm" onClick={() => setYear(y => y + 1)}>›</button>
                    </div>

                    <div className="mp-grid">
                        {months.map((lbl, idx) => {
                            const m = idx + 1;
                            const isActive = m === month && year === initY && fmtMy(year, m) === value;
                            return (
                                <button
                                    key={lbl}
                                    type="button"
                                    className={`mp-cell ${isActive ? "is-active" : ""}`}
                                    onClick={() => commit(year, m)}
                                >
                                    {lbl}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
