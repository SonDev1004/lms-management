import React from "react";
import "../styles/table.css";
import "../styles/badges.css";
import { initials, timeAgo } from "../utils/formatters";
import RowActions from "./RowActions";
import Pager from "./Pager";

const roleChip = (role) => {
    const key = role.toLowerCase();
    if (key.includes("teacher")) return "role-teacher";
    if (key.includes("student")) return "role-student";
    if (key.includes("admin"))   return "role-admin";
    return "role-manager";
};

export default function AccountsTable({
                                          items, page, rows, total, onPage,
                                          onView, onEdit, onToggleStatus, onResetPwd
                                      }){
    return (
        <div className="am-card" style={{marginTop:16}}>
            <table className="am-table">
                <thead className="am-thead">
                <tr>
                    <th style={{width:280}}>Name ⬍</th>
                    <th>Email ⬍</th>
                    <th style={{width:140}}>Role ⬍</th>
                    <th style={{width:140}}>Status ⬍</th>
                    <th style={{width:170}}>Created ⬍</th>
                    <th style={{width:180}}>Last Login</th>
                    <th style={{width:150, textAlign:"right"}}>Actions</th>
                </tr>
                </thead>
                <tbody className="am-tbody">
                {items.map(u=>(
                    <tr key={u.id} className="am-row">
                        <td className="am-col-name">
                            <span className="am-avatar">{initials(u.name)}</span>
                            <span>{u.name}</span>
                        </td>
                        <td className="am-email">
                            {u.email} <i className="pi pi-clone" style={{marginLeft:8, opacity:.6}}/>
                        </td>
                        <td><span className={`badge ${roleChip(u.role)}`}>{u.role}</span></td>
                        <td><span className={`badge ${u.status === "Active" ? "active" : "inactive"}`}>{u.status}</span></td>
                        <td>{new Date(u.created).toLocaleString("en-GB", {day:"2-digit",month:"2-digit",year:"numeric", hour:"2-digit", minute:"2-digit"})}</td>
                        <td>{timeAgo(new Date(Date.now()-u.lastLoginOffsetDays*24*3600*1000).toISOString())}</td>
                        <td>
                            <RowActions
                                onView={()=>onView(u)}
                                onEdit={()=>onEdit(u)}
                                onToggleStatus={()=>onToggleStatus(u)}
                                onResetPwd={()=>onResetPwd(u)}
                            />
                        </td>
                    </tr>
                ))}
                {items.length===0 && (
                    <tr>
                        <td colSpan={7}>
                            <div style={{padding:24, textAlign:"center", color:"#6b7280"}}>No results</div>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={7} className="am-footer">
                        <Pager page={page} rows={rows} total={total} onPage={onPage} />
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    )
}
