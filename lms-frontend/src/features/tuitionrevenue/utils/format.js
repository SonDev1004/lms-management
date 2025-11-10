export const fmtVND = (n) =>
    (n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

export const shortDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB");

export function exportCSV(rows){
    const headers = ["Date","Student","Code","Program","Subject","Amount","Method","Bank","TranNo","Status","Order Info"];
    const lines = rows.map(r=>[
        shortDate(r.date), r.student, r.code, r.program, r.subject, r.amount, r.method, r.bank, r.tranNo, r.status, r.orderInfo
    ].map(v=>`"${String(v).replaceAll('"','""')}"`).join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tuition-transactions-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
}
