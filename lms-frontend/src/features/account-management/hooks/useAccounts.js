import { useEffect, useMemo, useState } from "react";

const ROLES = ["Student","Teacher","Academic Manager","Admin IT"];
const STATUSES = ["Active","Inactive","Pending"];

const sample = [
    { id:1, name:"Stephanie Jackson", email:"stephanie.jackson159@university.edu", role:"Teacher", status:"Active", created:"2025-11-07T21:08:00", lastLoginOffsetDays:21 },
    { id:2, name:"Daniel Williams",   email:"daniel.williams122@university.edu",   role:"Teacher", status:"Active", created:"2025-11-06T21:08:00", lastLoginOffsetDays:4 },
    { id:3, name:"Jennifer Jones",    email:"jennifer.jones11@university.edu",     role:"Student", status:"Active", created:"2025-10-29T21:08:00", lastLoginOffsetDays:61 },
    { id:4, name:"Anthony Lopez",     email:"anthony.lopez148@university.edu",     role:"Student", status:"Active", created:"2025-10-29T21:08:00", lastLoginOffsetDays:61 },
    { id:5, name:"Jennifer Wilson",   email:"jennifer.wilson97@university.edu",    role:"Student", status:"Active", created:"2025-10-25T21:08:00", lastLoginOffsetDays:32 },
    { id:6, name:"Daniel Rodriguez",  email:"daniel.rodriguez34@university.edu",   role:"Student", status:"Active", created:"2025-10-24T21:08:00", lastLoginOffsetDays:31 },
    { id:7, name:"Elizabeth Martinez",email:"elizabeth.martinez61@university.edu", role:"Student", status:"Inactive", created:"2025-10-24T21:08:00", lastLoginOffsetDays:9 },
    { id:8, name:"David Miller",      email:"david.miller89@university.edu",       role:"Teacher", status:"Active", created:"2025-10-22T21:08:00", lastLoginOffsetDays:7 },
];

export function useAccounts(){
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [role, setRole] = useState(null);
    const [status, setStatus] = useState(null);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [sortBy, setSortBy] = useState("Created Date");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);

    useEffect(()=>{ setLoading(true); const t=setTimeout(()=>{ setItems(sample); setLoading(false); }, 250); return ()=>clearTimeout(t); },[]);

    const filtered = useMemo(()=>{
        let arr = [...items];
        if (query) {
            const q = query.toLowerCase();
            arr = arr.filter(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
        }
        if (role)   arr = arr.filter(a => a.role === role);
        if (status) arr = arr.filter(a => a.status === status);
        if (from)   arr = arr.filter(a => new Date(a.created) >= from);
        if (to)     arr = arr.filter(a => new Date(a.created) <= to);

        switch (sortBy) {
            case "Name":  arr.sort((a,b)=>a.name.localeCompare(b.name)); break;
            case "Email": arr.sort((a,b)=>a.email.localeCompare(b.email)); break;
            default:      arr.sort((a,b)=>new Date(b.created)-new Date(a.created));
        }
        return arr;
    }, [items, query, role, status, from, to, sortBy]);

    const total = filtered.length;
    const start = (page-1)*rows;
    const end = start + rows;
    const paged = filtered.slice(start, end);

    const updateAccount = (id, patch) => setItems(prev => prev.map(x => x.id===id ? {...x, ...patch} : x));
    const resetPassword = (_id) => true;

    const resetFilters = () => {
        setQuery(""); setRole(null); setStatus(null); setFrom(null); setTo(null); setSortBy("Created Date"); setPage(1);
    };

    return {
        items:paged, total, loading, page, rows, setPage, setRows,
        filters:{ query, setQuery, role, setRole, status, setStatus, from, setFrom, to, setTo, sortBy, setSortBy, resetFilters },
        actions:{ updateAccount, resetPassword },
        options:{ roles:ROLES, statuses:STATUSES }
    };
}
