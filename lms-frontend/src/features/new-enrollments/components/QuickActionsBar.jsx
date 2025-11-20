import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function QuickActionsBar({
                                            selected = [],
                                            onBulkApprove,
                                            onBulkReject,
                                            search,
                                            onSearch,
                                        }) {
    return (
        <div className="ne-actions-bar">
            <div className="ne-actions-left">
                <Button
                    className="ne-btn-approve"
                    icon="pi pi-check"
                    label="Bulk Approve"
                    onClick={onBulkApprove}
                    disabled={!selected.length}
                />
                <Button
                    className="ne-btn-reject"
                    icon="pi pi-times"
                    label="Bulk Reject"
                    onClick={onBulkReject}
                    disabled={!selected.length}
                />
            </div>

            <div className="ne-actions-right">
        <span className="p-input-icon-left ne-search">
          <i className="pi pi-search" />
          <InputText
              value={search || ""}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Name, email, phone, or student ID"
              aria-label="Search students"
          />
        </span>
            </div>
        </div>
    );
}
