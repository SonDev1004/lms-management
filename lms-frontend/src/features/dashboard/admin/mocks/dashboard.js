export const kpis = [
    {
        id: "totalUsers",
        title: "Total Users",
        value: 1298,
        deltaText: "+12% from last month",
        deltaTone: "positive",
        icon: "pi pi-users",
    },
    {
        id: "activeLicenses",
        title: "Active Licenses",
        value: 87,
        deltaText: "+3 from last month",
        deltaTone: "positive",
        icon: "pi pi-box",
    },
    {
        id: "securityAlerts",
        title: "Security Alerts",
        value: 5,
        deltaText: "-2 from last month",
        deltaTone: "negative",
        icon: "pi pi-exclamation-triangle",
    },
    {
        id: "systemHealth",
        title: "System Health",
        value: "99.9%",
        deltaText: "+0.1% from last month",
        deltaTone: "positive",
        icon: "pi pi-chart-line",
    },
];

export const quickActions = [
    {
        id: "invite",
        icon: "pi pi-user-plus",
        label: "Invite New User",
        description: "Add a new user to the system",
        intent: "primary",
    },
    {
        id: "roles",
        icon: "pi pi-shield",
        label: "Manage Roles",
        description: "Configure user permissions",
    },
    {
        id: "audit",
        icon: "pi pi-history",
        label: "View Audit Logs",
        description: "Review system activity",
    },
    {
        id: "settings",
        icon: "pi pi-cog",
        label: "System Settings",
        description: "Configure system preferences",
    },
];

export const activities = [
    {
        id: "a1",
        status: "success",
        title: "User Created",
        detail: "Sarah Johnson → john.doe@englishcenter.edu",
        time: "2 minutes ago",
    },
    {
        id: "a2",
        status: "success",
        title: "License Assigned",
        detail: "Mike Chen — Microsoft Office 365",
        time: "15 minutes ago",
    },
    {
        id: "a3",
        status: "warning",
        title: "MFA Disabled",
        detail: "Emily Davis — Security Policy Violation",
        time: "1 hour ago",
    },
    {
        id: "a4",
        status: "success",
        title: "Software Deployed",
        detail: "System → Zoom Client v5.16.2",
        time: "2 hours ago",
    },
];

export const licenses = [
    {
        id: "adobe",
        name: "Adobe Creative Suite",
        seats: { used: 23, total: 25 },
        daysLeft: 15,
        status: "expiring", // chip text
        tone: "warn",
    },
    {
        id: "o365",
        name: "Microsoft Office 365",
        seats: { used: 87, total: 100 },
        daysLeft: 142,
        status: "active",
        tone: "ok",
    },
    {
        id: "zoom",
        name: "Zoom Pro",
        seats: { used: 42, total: 50 },
        daysLeft: 218,
        status: "active",
        tone: "ok",
    },
];
