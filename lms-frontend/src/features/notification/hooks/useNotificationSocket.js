import { useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

window.global = window;

const API_ROOT_RAW = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:8081/api").replace(/\/+$/, "");
const WS_ORIGIN = API_ROOT_RAW.replace(/\/api$/i, "");
const WS_URL = `${WS_ORIGIN}/ws-notifications`;

export default function useNotificationSocket(userId, onMessage) {
    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            debug: () => {},
            onStompError: (frame) => console.error("[STOMP ERROR]", frame?.headers, frame?.body),
            onWebSocketClose: (evt) => console.warn("[WS CLOSED]", evt?.code, evt?.reason),
        });

        client.onConnect = () => {
            client.subscribe(`/topic/notifications/${userId}`, (msg) => {
                if (!msg?.body) return;
                try {
                    onMessage?.(JSON.parse(msg.body));
                } catch (e) {
                    console.warn("Cannot parse WS message", e, msg?.body);
                }
            });
        };

        client.activate();
        return () => {
            if (client.active) client.deactivate();
        };
    }, [userId, onMessage]);
}
