import { useEffect, useState } from "react";
import { getMyNotifications, getUnseenNotifications, markAsSeen } from "../api/notificationService";
import useNotificationSocket from "./useNotificationSocket";

// ===== store module-level (dùng chung toàn app) =====
const listeners = new Set();
const toId = (v) => (v === null || v === undefined ? null : String(v));
const eqId = (a, b) => a != null && b != null && String(a) === String(b);
const normalize = (m = {}) => ({
    id: toId(m.id), title: m.title ?? "", content: m.content ?? m.message ?? "",
    isSeen: m.isSeen ?? m.read ?? false, type: m.type ?? m.notificationType ?? "system",
    postedDate: m.postedDate ?? m.date ?? m.createdAt ?? null, sender: m.sender ?? "System",
    url: m.url || "", course: m.course || "",
});
const isSameLogical = (a, b) => {
    if (!a || !b) return false;
    if (a.id && b.id) return eqId(a.id, b.id);
    return a.title === b.title && a.type === b.type &&
        a.postedDate && b.postedDate && String(a.postedDate) === String(b.postedDate);
};

const store = { notifications: [], loading: true };
const emit  = () => listeners.forEach(cb => cb({ notifications: store.notifications, loading: store.loading }));

async function loadAll() {
    store.loading = true; emit();
    try {
        const data = await getMyNotifications();
        store.notifications = (data || []).map(normalize);
    } finally {
        store.loading = false; emit();
    }
}
const setLocalSeen = (id, original, seen) => {
    const normId = toId(id);
    store.notifications = store.notifications.map(n =>
        (normId ? eqId(n.id, normId) : isSameLogical(n, original)) ? { ...n, isSeen: seen } : n
    );
    emit();
};

// ===== hook public =====
export function useNotifications({ onPopup, enableSocket = false } = {}) {
    const [state, setState] = useState({ notifications: store.notifications, loading: store.loading });

    // subscribe store
    useEffect(() => {
        const cb = (s) => setState(s);
        listeners.add(cb);
        if (store.notifications.length === 0) loadAll();
        return () => listeners.delete(cb);
    }, []);

    // ✅ GỌI HOOK Ở TOP-LEVEL (không đặt trong useEffect)
    useNotificationSocket(
        (newNoti) => {
            const safe = normalize(newNoti);
            store.notifications = [safe, ...store.notifications.filter(x => !isSameLogical(x, safe))];
            emit();
            onPopup?.(safe);
        },
        {
            enabled: enableSocket,                    // chỉ Provider bật true
            debug: import.meta.env.DEV,
            getToken: () => localStorage.getItem("accessToken"),
        }
    );

    // actions
    const load = () => loadAll();

    const markRead = async (id, original) => {
        const normId = toId(id);
        setLocalSeen(normId, original, true);   // optimistic
        if (!normId) return true;               // broadcast (không id)

        try { await markAsSeen(normId); return true; }
        catch (e) { setLocalSeen(normId, original, false); console.warn("markRead failed", e); return false; }
    };

    const markAllRead = async () => {
        const snapshot = store.notifications;
        store.notifications = snapshot.map(n => ({ ...n, isSeen: true })); emit();
        try {
            const unseen = await getUnseenNotifications();
            await Promise.allSettled((unseen || []).map(n => markAsSeen(toId(n.id))));
        } catch (e) {
            store.notifications = snapshot; emit();
            console.warn("markAllRead failed", e);
        }
    };

    const remove = (idOrObj) => {
        const normId = typeof idOrObj === "object" ? toId(idOrObj?.id) : toId(idOrObj);
        store.notifications = store.notifications.filter(n => {
            if (normId) return !eqId(n.id, normId);
            if (typeof idOrObj === "object") return !isSameLogical(n, idOrObj);
            return true;
        });
        emit();
    };

    return { notifications: state.notifications, loading: state.loading, load, markRead, markAllRead, remove };
}
