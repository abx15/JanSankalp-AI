export const config = {
    app: {
        name: "JanSankalp AI",
        version: "1.0.0",
        description: "Sovereign AI Governance Platform",
    },
    ai: {
        defaultTimeout: 5000,
        maxRetries: 3,
    },
    auth: {
        cookieName: "jansankalp-auth",
        tokenExpiry: "24h",
    },
    monitoring: {
        enabled: process.env.NODE_ENV === "production",
    }
};
