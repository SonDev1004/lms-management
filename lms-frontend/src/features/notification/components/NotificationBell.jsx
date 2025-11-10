import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { format } from "date-fns";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell({ userId }) {
    const opRef = useRef(null);
    const { notifications, markRead } = useNotifications({ userId });
    const unseen = notifications.filter(n => !n.isSeen);

    return (
        <>
            <div className="relative cursor-pointer" onClick={(e) => opRef.current?.toggle(e)}>
                <i className="pi pi-bell text-xl" />
                {unseen.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unseen.length}
          </span>
                )}
            </div>

            <OverlayPanel ref={opRef} className="w-96">
                <div className="p-2">
                    {unseen.length === 0 ? (
                        <div className="text-sm text-gray-500">Không có thông báo mới</div>
                    ) : (
                        unseen.map((n) => (
                            <div key={n.id} className="border-b border-gray-100 py-2">
                                <div className="font-semibold">{n.title}</div>
                                <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: n.content }} />
                                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">
                    {n.postedDate ? format(new Date(n.postedDate), "dd/MM HH:mm") : ""}
                  </span>
                                    <Button text label="Đã xem" size="small" onClick={() => markRead(n.id)} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </OverlayPanel>
        </>
    );
}
