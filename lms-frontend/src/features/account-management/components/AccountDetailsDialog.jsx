import React from "react";
import { Dialog } from "primereact/dialog";
import "../styles/dialogs.css";
import "../styles/badges.css";
import { initials } from "../utils/formatters";

const bar = (text, kind) => (
    <div className={`detail-bar ${kind}`}>
        <span>{text}</span>
    </div>
);

export default function AccountDetailsDialog({ visible, value = {}, onHide, onEdit }) {
    if (!value) return null;

    return (
        <Dialog
            className="am-dialog am-detail"
            closable={false}
            header={
                <div className="detail-header">
                    <span>Account Details</span>
                    <div className="header-actions">
                        <button className="icon-ghost" title="Edit" onClick={onEdit} aria-label="Edit">
                            <i className="pi pi-pencil" />
                        </button>
                        <button className="icon-ghost" title="Close" onClick={onHide} aria-label="Close">
                            <i className="pi pi-times" />
                        </button>
                    </div>
                </div>
            }
            visible={visible}
            onHide={onHide}
            dismissableMask
            draggable={false}
            style={{ width: 720 }}
        >
            <div className="detail-block">
                <div className="avatar-lg">{initials(value.name)}</div>
                <div className="kv">
                    <div className="k">Full Name</div>
                    <div className="v">{value.name}</div>
                </div>
            </div>

            <div className="kv">
                <div className="k">Email Address</div>
                <div className="v">{value.email}</div>
            </div>

            <div className="kv">
                <div className="k">Role</div>
                <div className="v">{bar(value.role, "role")}</div>
            </div>

            <div className="kv">
                <div className="k">Status</div>
                <div className="v">
                    {bar(
                        value.status,
                        value.status?.toLowerCase() === "active"
                            ? "status-active"
                            : value.status?.toLowerCase() === "pending"
                                ? "status-pending"
                                : "status-inactive"
                    )}
                </div>
            </div>

            <div className="kv">
                <div className="k">Notes</div>
                <div className="v">Account for {value.name}</div>
            </div>

            <div className="kv">
                <div className="k">Account ID</div>
                <div className="v">{value.id}</div>
            </div>

            <div className="kv">
                <div className="k">Created Date</div>
                <div className="v">{new Date(value.created).toLocaleDateString("en-GB")}</div>
            </div>

            <div className="kv">
                <div className="k">Last Login</div>
                <div className="v">{value.lastLoginOffsetDays ? "about 1 month ago" : "Never"}</div>
            </div>

            <div className="footer right">
                <button className="btn-link" onClick={onHide}>
                    <i className="pi pi-times" style={{ marginRight: 6 }} />
                    Close
                </button>
            </div>
        </Dialog>
    );
}
