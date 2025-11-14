import React from "react";
export default function EmptyState({ text="No data" }){
    return <div style={{padding:24, textAlign:"center", color:"#6b7280"}}>{text}</div>;
}
