let process;
const API_URL = import.meta?.env?.VITE_API_URL ?? process.env.REACT_APP_API_URL ?? '';

const AUTH_PREFIX = '/api/auth';

async function safeParseJson(res) {
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return null; }
}
function unwrap(result) {
    return result?.result ?? result;
}

/**
 * login({ username, password })
 * Gọi POST /api/auth/login
 * Trả về object { accessToken, refreshToken, userName, permissions }
 */
export async function login({ username, password }) {
    const res = await fetch(`${API_URL}${AUTH_PREFIX}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await safeParseJson(res);
    if (!res.ok) {
        const message = data?.message || data?.result?.message || res.statusText || 'Login failed';
        const err = new Error(message);
        err.response = data;
        throw err;
    }

    const result = unwrap(data);
    const auth = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userName: result.userName,
        permissions: result.Permissions ?? result.permissions ?? []
    };

    // lưu token / user info
    if (auth.accessToken) localStorage.setItem('accessToken', auth.accessToken);
    if (auth.refreshToken) localStorage.setItem('refreshToken', auth.refreshToken);
    localStorage.setItem('userInfo', JSON.stringify({ userName: auth.userName, permissions: auth.permissions }));

    return auth;
}

/** logout đơn giản: gọi API nếu muốn rồi xóa localStorage */
export async function logout() {
    const token = localStorage.getItem('accessToken');
    try {
        await fetch(`${API_URL}${AUTH_PREFIX}/logout`, {
            method: 'POST',
            headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
    } catch (e) {
        console.warn('Logout request failed', e);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
    }
}
