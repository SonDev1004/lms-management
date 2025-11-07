import {useEffect} from "react";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

window.global = window;

const API_ROOT_RAW = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:8081/api").replace(/\/+$/, "");
const WS_ORIGIN = API_ROOT_RAW.replace(/\/api$/i, "");
const WS_URL = `${WS_ORIGIN}/ws-notifications`;

export default function useNotificationSocket(onMessage, {debug = false} = {}) {
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 3000,
            heartbeatIncoming: 15000,
            heartbeatOutgoing: 15000,
            debug: debug ? (s) => console.log("%c[STOMP]", "color:#0ea5a4", s) : () => {
            },
            onStompError: (frame) => console.error("[STOMP ERROR]", frame.headers?.message, frame.body),
            onWebSocketClose: (e) => console.warn("[WS CLOSED]", e?.code, e?.reason || ""),
            onWebSocketError: (e) => console.error("[WS ERROR]", e),
            onUnhandledMessage: (msg) => {
                // Nếu server gửi tới topic mà mình chưa sub đúng -> log ở đây
                console.warn("[WS] Unhandled message:", msg.headers?.destination, msg.body);
            },
        });

        client.onConnect = () => {
            console.log("[WS] connected", WS_URL);

            // User-destination (convertAndSendToUser)
            client.subscribe("/user/topic/notifications", (msg) => {
                console.log("[WS] /user/topic/notifications <-", msg.body);
                try {
                    const data = JSON.parse(msg.body);
                    onMessage?.(data);
                } catch (err) {
                    console.warn("[WS] parse user fail", err, msg?.body);
                }
            });

            // Broadcast
            client.subscribe("/topic/notifications.broadcast", (msg) => {
                console.log("[WS] /topic/notifications.broadcast <-", msg.body);
                try {
                    const data = JSON.parse(msg.body);
                    onMessage?.(data);
                } catch (err) {
                    console.warn("[WS] parse broadcast fail", err, msg?.body);
                }
            });
        };

        client.activate();
        return () => client.deactivate();
    }, [onMessage, debug]);
}
