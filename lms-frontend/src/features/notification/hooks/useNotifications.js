import {useEffect, useState} from "react";
import {
    getMyNotifications,
    getUnseenNotifications,
    markAsSeen,
} from "../api/notificationService";
import useNotificationSocket from "./useNotificationSocket";

const listeners = new Set();

const toId = (v) => (v === null || v === undefined ? null : String(v));
const eqId = (a, b) => a != null && b != null && String(a) === String(b);

const normalize = (m = {}) => ({
    id: toId(m.id),
    title: m.title ?? "",
    content: m.content ?? m.message ?? "",
    isSeen: !!(m.isSeen ?? m.read),
    type: m.type ?? m.notificationType ?? "system",
    postedDate: m.postedDate ?? m.date ?? m.createdAt ?? null,
    sender: m.sender ?? "System",
    url: m.url || "",
    course: m.course || "",
});

const store = {
    notifications: [],
    loading: true,
};

const emit = () => {
    const snapshot = {
        notifications: store.notifications,
        loading: store.loading,
    };
    listeners.forEach((cb) => cb(snapshot));
};

async function loadAll() {
    store.loading = true;
    emit();
    try {
        const data = await getMyNotifications();
        store.notifications = (data || []).map(normalize);
    } finally {
        store.loading = false;
        emit();
    }
}

function setLocalSeen(id, seen) {
    const normId = toId(id);
    if (!normId) return;
    store.notifications = store.notifications.map((n) =>
        eqId(n.id, normId) ? {...n, isSeen: seen} : n
    );
    emit();
}
export function useNotifications({onPopup, enableSocket = false} = {}) {
    const [state, setState] = useState({
        notifications: store.notifications,
        loading: store.loading,
    });

    // subscribe store
    useEffect(() => {
        const cb = (s) => setState(s);
        listeners.add(cb);

        if (store.notifications.length === 0) {
            loadAll();
        } else {
            cb({
                notifications: store.notifications,
                loading: store.loading,
            });
        }

        return () => listeners.delete(cb);
    }, []);

    // socket
    useNotificationSocket(
        (raw) => {
            const safe = normalize(raw);
            const idx = store.notifications.findIndex((n) => eqId(n.id, safe.id));
            if (idx >= 0) {
                store.notifications[idx] = {...store.notifications[idx], ...safe};
            } else {
                store.notifications = [safe, ...store.notifications];
            }
            emit();
            onPopup?.(safe);
        },
        {
            enabled: enableSocket,
            debug: import.meta.env.DEV,
            getToken: () => localStorage.getItem("accessToken"),
        }
    );

    // actions
    const load = () => loadAll();

    const markRead = async (id) => {
        const normId = toId(id);
        if (!normId) return false;

        setLocalSeen(normId, true); // optimistic
        try {
            await markAsSeen(normId);
            return true;
        } catch (e) {
            console.warn("markRead failed", e);
            setLocalSeen(normId, false); // rollback nếu BE lỗi
            return false;
        }
    };

    const markAllRead = async () => {
        const prev = store.notifications;
        store.notifications = prev.map((n) => ({...n, isSeen: true}));
        emit();

        try {
            const unseen = await getUnseenNotifications();
            await Promise.allSettled(
                (unseen || []).map((n) => markAsSeen(toId(n.id)))
            );
        } catch (e) {
            console.warn("markAllRead failed", e);
            store.notifications = prev;
            emit();
        }
    };

    const remove = (idOrObj) => {
        const normId =
            typeof idOrObj === "object" ? toId(idOrObj?.id) : toId(idOrObj);
        if (!normId) return;
        store.notifications = store.notifications.filter(
            (n) => !eqId(n.id, normId)
        );
        emit();
    };

    return {
        notifications: state.notifications,
        loading: state.loading,
        load,
        markRead,
        markAllRead,
        remove,
    };
}
