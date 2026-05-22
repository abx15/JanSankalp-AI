declare const _default: () => {
    port: number;
    database: {
        url: string;
    };
    redis: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    aiService: {
        url: string;
        secretToken: string;
    };
    pusher: {
        appId: string;
        key: string;
        secret: string;
        cluster: string;
    };
    smtp: {
        email: string;
        password: string;
    };
    resend: {
        apiKey: string;
    };
};
export default _default;
