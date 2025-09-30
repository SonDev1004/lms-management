export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

export const fmtDate = (iso) => {
    if (!iso) return '--';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export const letterFromScore = (score) => {
    if (score == null) return '';
    if (score >= 95) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    return 'D';
};

export const toCSV = (rows, header) => {
    const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const body = rows
        .map((r) => {
            if (Array.isArray(r)) return r.map(esc).join(',');
            const keys = header ?? Object.keys(r);
            return keys.map((k) => esc(r[k])).join(',');
        })
        .join('\n');
    const head = header ? header.map(esc).join(',') + '\n' : '';
    return head + body;
};

export const downloadCSV = (filename, text) => {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
};
