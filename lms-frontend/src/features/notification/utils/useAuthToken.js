import { useEffect, useState } from "react";

/**
 * Hook theo dõi accessToken “sống” trong localStorage.
 * Tự cập nhật khi axios interceptor refresh token.
 */
export default function useAuthToken() {
    const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

    useEffect(() => {
        // đồng bộ khi tab khác thay đổi
        const onStorage = (e) => {
            if (e.key === "accessToken") setToken(e.newValue);
        };
        window.addEventListener("storage", onStorage);

        // nhịp kiểm tra nhẹ để bắt kịp axios interceptor vừa refresh
        const i = setInterval(() => {
            const t = localStorage.getItem("accessToken");
            setToken((prev) => (prev !== t ? t : prev));
        }, 1000);

        return () => {
            window.removeEventListener("storage", onStorage);
            clearInterval(i);
        };
    }, []);

    return token; // null | "eyJ..."
}
