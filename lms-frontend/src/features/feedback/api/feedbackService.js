import { mockDb } from "./mockDb";

const sleep = (ms = 320) => new Promise(r => setTimeout(r, ms));

export async function listFeedback(params = {}) {
    await sleep();
    const all = mockDb.load();
    let rows = [...all];

    if (params.q) {
        const q = params.q.toLowerCase();
        rows = rows.filter(
            x =>
                x.title.toLowerCase().includes(q) ||
                x.message.toLowerCase().includes(q) ||
                x.user.name.toLowerCase().includes(q) ||
                x.tags?.some(t => t.toLowerCase().includes(q))
        );
    }
    if (params.status && params.status !== "All") {
        rows = rows.filter(x => x.status === params.status);
    }
    if (params.category && params.category !== "All") {
        rows = rows.filter(x => x.category === params.category);
    }

    if (params.rating && params.rating !== "All") {
        const min = Number(params.rating[0]); // "4★+" -> 4
        rows = rows.filter(x => (x.rating || 0) >= min);
    }
    if (params.time && params.time !== "All Time") {
        const days = params.time.includes("7") ? 7 : 30;
        const from = new Date(Date.now() - days * 86400000);
        rows = rows.filter(x => new Date(x.createdAt) >= from);
    }

    switch (params.sort) {
        case "date":
        case "newest":
            rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case "rating":
            rows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case "status":
            rows.sort((a, b) => a.status.localeCompare(b.status));
            break;
        default:
            break;
    }

    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? 8;
    const total = rows.length;
    const start = page * pageSize;
    const data = rows.slice(start, start + pageSize);

    return { data, total, page, pageSize };
}

export async function getFeedback(id) {
    await sleep();
    return mockDb.load().find(x => x.id === Number(id));
}

export async function createFeedback(payload) {
    await sleep();
    const db = mockDb.load();
    const id = (db.map(x => x.id).sort((a, b) => b - a)[0] ?? 1000) + 1;
    const now = new Date().toISOString();

    const row = {
        id,
        user: payload.user ?? { id: 0, name: "Guest", email: "guest@dol.edu" },
        title: payload.title,
        message: payload.message,
        rating: payload.rating ?? 0,
        category: payload.category ?? "General",
        subcategory: payload.subcategory ?? null,
        status: "Open",
        createdAt: now,
        updatedAt: now,
        attachments: payload.attachments ?? [],
        replies: [],
        tags: payload.tags ?? [],
    };

    db.unshift(row);
    mockDb.save(db);
    return row;
}

export async function updateStatus(id, status) {
    await sleep();
    const db = mockDb.load();
    const i = db.findIndex(x => x.id === Number(id));
    if (i < 0) throw new Error("Not found");
    db[i].status = status;
    db[i].updatedAt = new Date().toISOString();
    mockDb.save(db);
    return db[i];
}

export async function addReply(id, reply) {
    await sleep();
    const db = mockDb.load();
    const row = db.find(x => x.id === Number(id));
    if (!row) throw new Error("Not found");

    const msg = {
        id: (row.replies?.at(-1)?.id ?? 0) + 1,
        author: reply.author ?? { id: "staff-x", name: "Staff" },
        message: reply.message,
        createdAt: new Date().toISOString(),
    };

    row.replies = [...(row.replies || []), msg];
    row.updatedAt = new Date().toISOString();
    mockDb.save(db);
    return msg;
}

export async function getStats() {
    await sleep();
    const db = mockDb.load();
    const total = db.length;
    const open = db.filter(x => x.status === "Open" || x.status === "In Progress").length;
    const resolved = db.filter(x => x.status === "Resolved").length;
    const avg = total ? db.reduce((s, x) => s + (x.rating || 0), 0) / total : 0;
    return { total, open, resolved, avg };
}
