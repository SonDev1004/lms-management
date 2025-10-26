export const ACTIONS = [
    "User Created","User Updated","User Deleted",
    "License Assigned","License Revoked",
    "Software Deployed","Role Changed",
    "MFA Enabled","MFA Disabled","Login","Logout"
];

export const ACTORS = [
    "Sarah Johnson","Mike Chen","Emily Davis","System","Admin User"
];

export const AUDIT_LOGS = [
    {
        id: "ev-001",
        timestamp: "2024-10-25T17:30:00Z",
        actor: "Sarah Johnson",
        action: "User Created",
        resource: "john.doe@englishcenter.edu",
        details: "New teacher account created",
        ip: "192.168.1.100",
        status: "success"
    },
    {
        id: "ev-002",
        timestamp: "2024-10-25T16:15:00Z",
        actor: "Mike Chen",
        action: "License Assigned",
        resource: "Microsoft Office 365",
        details: "License assigned to new user",
        ip: "192.168.1.105",
        status: "success"
    },
    {
        id: "ev-003",
        timestamp: "2024-10-25T15:45:00Z",
        actor: "System",
        action: "Software Deployed",
        resource: "Zoom Client v5.16.2",
        details: "Automatic deployment to Pilot ring completed",
        ip: null,
        status: "info"
    }
];
