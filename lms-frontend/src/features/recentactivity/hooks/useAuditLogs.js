import { useMemo, useState } from "react";
import { AUDIT_EVENTS, ACTION_OPTIONS, ACTOR_OPTIONS, DATE_RANGE_OPTIONS } from "../mocks/auditEvents.mock";

function inRange(ts, range){
    if(range==="all") return true;
    const d=new Date(ts), now=new Date();
    if(range==="today") return d.toDateString()===now.toDateString();
    const from=new Date();
    if(range==="7d") from.setDate(from.getDate()-7);
    else if(range==="30d") from.setDate(from.getDate()-30);
    return d>=from && d<=now;
}

export default function useAuditLogs(){
    const [query,setQuery]=useState("");
    const [dateRange,setDateRange]=useState("7d");
    const [action,setAction]=useState("all");
    const [actor,setActor]=useState("all");
    const [lastUpdated,setLastUpdated]=useState(new Date());

    const data=useMemo(()=> {
        const q=query.trim().toLowerCase();
        return AUDIT_EVENTS.filter(e =>
            inRange(e.timestamp,dateRange) &&
            (action==="all" || e.action===action) &&
            (actor==="all" || e.actor===actor) &&
            (q==="" || [e.actor,e.action,e.resource,e.details,(e.ip||"")].some(v=>v.toLowerCase().includes(q)))
        ).sort((a,b)=> new Date(b.timestamp)-new Date(a.timestamp));
    },[query,dateRange,action,actor]);

    return {
        data,
        filters:{ query,setQuery, dateRange,setDateRange, action,setAction, actor,setActor },
        lists:{ dateRanges:DATE_RANGE_OPTIONS, actions:ACTION_OPTIONS, actors:ACTOR_OPTIONS },
        meta:{ lastUpdated, refresh:()=>setLastUpdated(new Date()) }
    };
}
