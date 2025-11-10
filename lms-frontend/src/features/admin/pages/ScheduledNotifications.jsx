import { useEffect, useState } from "react";
import { getScheduledNotifications } from "@/features/notification/api/notificationService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { format } from "date-fns";

export default function ScheduledNotifications() {
    const [rows, setRows] = useState([]);
    const load = async () => setRows(await getScheduledNotifications());
    useEffect(() => { load(); }, []);

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Thông báo đã hẹn giờ</h2>
                <button className="p-button p-button-text" onClick={load}>Refresh</button>
            </div>

            <DataTable value={rows} paginator rows={10}>
                <Column field="title" header="Tiêu đề" />
                <Column field="type" header="Loại" />
                <Column field="severity" header="Mức độ" />
                <Column header="Thời gian gửi" body={(r) => r.postedDate ? format(new Date(r.postedDate), "dd/MM/yyyy HH:mm") : ""} />
                <Column field="url" header="URL" />
            </DataTable>
        </div>
    );
}
