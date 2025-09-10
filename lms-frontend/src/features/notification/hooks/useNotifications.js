import { useCallback, useEffect, useState } from 'react';
import { mockNotifications } from '../mocks/mockNotifications';

const mockApi = {
    get: () =>
        new Promise((resolve) =>
            setTimeout(() => resolve({ data: JSON.parse(JSON.stringify(mockNotifications)) }), 220)
        ),
    post: (url, body) =>
        new Promise((resolve) =>
            setTimeout(() => {
                if (url === '/notifications/mark-read') {
                    const id = body.id;
                    mockNotifications.forEach((n) => {
                        if (n.id === id) n.read = true;
                    });
                }
                if (url === '/notifications/mark-read-all') {
                    mockNotifications.forEach((n) => (n.read = true));
                }
                if (url === '/notifications/delete') {
                    const id = body.id;
                    const idx = mockNotifications.findIndex((n) => n.id === id);
                    if (idx >= 0) mockNotifications.splice(idx, 1);
                }
                resolve({ data: { success: true } });
            }, 160)
        ),
};

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await mockApi.get();
        const sorted = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(sorted);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const markRead = async (id) => {
        await mockApi.post('/notifications/mark-read', { id });
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllRead = async () => {
        await mockApi.post('/notifications/mark-read-all');
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const remove = async (id) => {
        await mockApi.post('/notifications/delete', { id });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return { notifications, loading, load, markRead, markAllRead, remove, setNotifications };
}
