import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { useNotifications } from "@/features/notification/hooks/useNotifications.js";

export default function NotificationsProvider({ children }) {
    const toastRef = useRef(null);

    useNotifications({
        enableSocket: true, // luôn lắng nghe WS ở root
        onPopup: (n) => {
            const plain = (n.content || "").replace(/<[^>]+>/g, "");
            toastRef.current?.show({
                severity: n.isSeen ? "info" : "success",
                summary: n.title || "Notification",
                detail: plain,
                life: 5000,
            });

            // (tuỳ chọn) web push nội bộ trình duyệt
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification(n.title || "Notification", { body: plain });
            }
        },
    });

    return (
        <>
            <Toast ref={toastRef} position="top-right" />
            {children}
        </>
    );
}
