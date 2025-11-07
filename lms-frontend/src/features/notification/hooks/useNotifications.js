import { useCallback, useEffect, useState } from "react";
import { getMyNotifications, getUnseenNotifications, markAsSeen } from "../api/notificationService";
import useNotificationSocket from "./useNotificationSocket";

export function useNotifications({ onPopup } = {}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyNotifications();
            setNotifications(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // 🔔 ĐÚNG chữ ký: (onMessage, options)
    useNotificationSocket(
        (newNoti) => {
            console.log("[WS] New notification:", newNoti);
            setNotifications((prev) => [newNoti, ...prev]);
            if (typeof onPopup === "function") onPopup(newNoti);
        },
        { debug: import.meta.env.DEV }
    );

    const markRead = async (id) => {
        try {
            await markAsSeen(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isSeen: true } : n)));
        } catch {
            console.log("Mark read failed for", id);
        }
    };

    const markAllRead = async () => {
        try {
            const unseen = await getUnseenNotifications();
            await Promise.allSettled(unseen.map((n) => markAsSeen(n.id)));
            setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
        } catch {
            console.log("Mark all read failed");
        }
    };

    const remove = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

    return { notifications, loading, load, markRead, markAllRead, remove, setNotifications };
}
