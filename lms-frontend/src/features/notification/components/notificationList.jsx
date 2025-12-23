import React, { useState } from "react";
import { Paginator } from "primereact/paginator";
import { Divider } from "primereact/divider";
import NotificatioItem from "./notificatioItem.jsx";
import NotificationDetailDialog from "./dialogs/notificationDetailDialog.jsx";

export default function NotificationList({ notifications = [], loading, onMarkRead, onDelete }) {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const openDetail = (n) => {
        setSelected(n);
        setOpen(true);
        if (!n.isSeen && onMarkRead) {
            onMarkRead(n.id);
        }
    };

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    const pageItems = notifications.slice(first, first + rows);

    if (loading && notifications.length === 0) {
        return (
            <div className="text-center p-5">
                <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                <p className="mt-3 text-600 font-medium">Loading notification...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center p-6">
                <div
                    className="inline-flex align-items-center justify-content-center border-circle mb-4"
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)'
                    }}
                >
                    <i className="pi pi-inbox text-5xl text-blue-300"></i>
                </div>
                <h3 className="text-700 font-semibold mb-2">no notification</h3>
                <p className="text-500 m-0">You have viewed all notifications or there are no new notifications</p>
            </div>
        );
    }

    return (
        <div>
            {/* Notification Items Grid */}
            <div className="grid">
                {pageItems.map((n) => (
                    <div key={n.id} className="col-12">
                        <NotificatioItem
                            n={n}
                            onOpen={openDetail}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
            </div>

            {/* Paginator */}
            {notifications.length > rows && (
                <>
                    <Divider className="my-3" />
                    <div className="flex justify-content-center">
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={notifications.length}
                            onPageChange={handlePageChange}
                            rowsPerPageOptions={[6, 12, 24, 48]}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                            currentPageReportTemplate="Show {first} - {last} of {totalRecords} notifications"
                            className="border-noround p-0"
                        />
                    </div>
                </>
            )}

            <NotificationDetailDialog
                visible={open}
                onHide={() => setOpen(false)}
                notification={selected}
                onDelete={onDelete}
            />
        </div>
    );
}