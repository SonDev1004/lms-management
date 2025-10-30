import { useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080";
const WS_URL = `${API_ROOT}/ws-notifications`;

export default function useNotificationSocket(userId, onMessage) {
    useEffect(() => {
        if (!userId) return;

        const sock = new SockJS(WS_URL);
        const stomp = over(sock);

        stomp.connect({}, () => {
            stomp.subscribe(`/topic/notifications/${userId}`, (frame) => {
                const data = JSON.parse(frame.body);
                onMessage?.(data);
            });
        });

        return () => stomp.disconnect(() => {});
    }, [userId, onMessage]);
}
