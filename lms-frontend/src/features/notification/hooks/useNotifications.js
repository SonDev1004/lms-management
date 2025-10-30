import { useCallback, useEffect, useState } from "react";
import {
    getMyNotifications,
    getUnseenNotifications,
    markAsSeen,
} from "../api/notificationService";
import useNotificationSocket from "./useNotificationSocket";

export function useNotifications({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyNotifications();
            const sorted = (data || []).sort(
                (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
            );
            setNotifications(sorted);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const markRead = async (id) => {
        await markAsSeen(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isSeen: true } : n)));
    };

    const markAllRead = async () => {
        const unseen = await getUnseenNotifications();
        await Promise.all(unseen.map((n) => markAsSeen(n.id)));
        setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
    };

    const remove = async (id) => {
        // BE chưa có delete; xóa local để UI gọn
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    // 🔔 realtime
    useNotificationSocket(userId, (newNoti) => {
        setNotifications((prev) => [newNoti, ...prev]);
    });

    return { notifications, loading, load, markRead, markAllRead, remove, setNotifications };
}
