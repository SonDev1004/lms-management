const KEY = "mock.feedback.db.v1";

const seed = () => ([
    {
        id: 1001,
        user: { id: 1, name: "Anna Nguyen", email: "anna@dol.edu" },
        title: "Great IELTS Intensive!",
        message:
            "The pace was perfect and materials were clear. Please add more full tests.",
        rating: 5,
        category: "Course",
        subcategory: "IELTS Intensive",
        status: "Open", // Open | In Progress | Resolved | Archived
        createdAt: "2025-09-16T09:25:00Z",
        updatedAt: "2025-09-16T09:25:00Z",
        attachments: [],
        replies: [
            {
                id: 1,
                author: { id: "staff-7", name: "Linh (Support)" },
                message: "Thanks Anna! We will add two more mock tests this weekend.",
                createdAt: "2025-09-16T11:40:00Z",
            },
        ],
        tags: ["ielts", "material"],
    },
    {
        id: 1002,
        user: { id: 7, name: "Bao Tran", email: "bao@dol.edu" },
        title: "App crashes during attendance",
        message:
            "When marking attendance on mobile, the screen freezes at Save step.",
        rating: 2,
        category: "Platform",
        subcategory: "Teacher App",
        status: "In Progress",
        createdAt: "2025-09-20T07:10:00Z",
        updatedAt: "2025-09-23T15:00:00Z",
        attachments: [
            { id: "att-1", name: "freeze.mp4", url: "/samples/freeze.mp4" },
        ],
        replies: [],
        tags: ["bug", "mobile"],
    },
    {
        id: 1003,
        user: { id: 12, name: "Huy Le", email: "huy@dol.edu" },
        title: "Please add dark mode",
        message: "Dark theme would help night study.",
        rating: 4,
        category: "Platform",
        subcategory: "UI/UX",
        status: "Resolved",
        createdAt: "2025-08-05T18:00:00Z",
        updatedAt: "2025-09-01T08:00:00Z",
        attachments: [],
        replies: [
            {
                id: 1,
                author: { id: "staff-2", name: "Duc (FE)" },
                message:
                    "Shipped in v2.9. Toggle is in Settings → Appearance. Thank you!",
                createdAt: "2025-09-01T08:00:00Z",
            },
        ],
        tags: ["feature", "ui"],
    },
]);

function load() {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const data = seed();
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
}

function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export const mockDb = { load, save };