export const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' });

export const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
