import React from "react";

export default function Pager({ page, rows, total, onPage }) {
    const pages = Math.max(1, Math.ceil((total || 0) / (rows || 1)));
    const go = (p) => onPage(Math.max(1, Math.min(p, pages)));

    const around = [page - 1, page, page + 1].filter(p => p >= 1 && p <= pages);

    return (
        <div className="am-pager">
            <button className="nav" aria-disabled={page === 1} onClick={() => go(1)}>{'«'}</button>
            <button className="nav" aria-disabled={page === 1} onClick={() => go(page - 1)}>{'‹'}</button>

            {around[0] > 1 && <span className="gap">…</span>}
            {around.map(p => (
                <button
                    key={p}
                    className={`page${p === page ? ' is-active' : ''}`}
                    onClick={() => go(p)}
                >
                    {p}
                </button>
            ))}
            {around.at(-1) < pages && <span className="gap">…</span>}

            <button className="nav" aria-disabled={page === pages} onClick={() => go(page + 1)}>{'›'}</button>
            <button className="nav" aria-disabled={page === pages} onClick={() => go(pages)}>{'»'}</button>
        </div>
    );
}
