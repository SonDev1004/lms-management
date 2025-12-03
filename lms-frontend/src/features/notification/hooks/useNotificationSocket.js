import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

window.global = window;

// .env: VITE_API_ENDPOINT=http://localhost:8081/api
const API_ROOT_RAW = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:8081/api").replace(/\/+$/, "");
const WS_ORIGIN = API_ROOT_RAW.replace(/\/api$/i, "");
const WS_URL = `${WS_ORIGIN}/ws-notifications`;

export default function useNotificationSocket(
    onMessage,
    { debug = false, enabled = true, getToken } = {}
) {
    useEffect(() => {
        if (!enabled) return;
        const token = getToken ? getToken() : localStorage.getItem("accessToken");
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 3000,
            heartbeatIncoming: 15000,
            heartbeatOutgoing: 15000,
            connectHeaders: { Authorization: `Bearer ${token}` },
            debug: debug ? (s) => console.log("%c[STOMP]", "color:#0ea5a4", s) : () => {},
            onStompError: (f) => console.error("[STOMP ERROR]", f.headers?.message, f.body),
            onWebSocketClose: (e) => console.warn("[WS CLOSED]", e?.code, e?.reason || ""),
            onWebSocketError: (e) => console.error("[WS ERROR]", e),
        });

        client.onConnect = () => {
            client.subscribe("/user/queue/notifications", (msg) => {
                try { onMessage?.(JSON.parse(msg.body)); } catch {}
            });
            client.subscribe("/topic/notifications", (msg) => {
                try { onMessage?.(JSON.parse(msg.body)); } catch {}
            });
            if (debug) console.log("[WS] connected", WS_URL);
        };

        client.activate();
        return () => client.deactivate();
    }, [enabled, onMessage, debug, getToken]);
}
