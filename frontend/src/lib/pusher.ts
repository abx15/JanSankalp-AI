import Pusher from "pusher";

export const pusherServer = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || "dummy-app-id",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "dummy-key",
    secret: process.env.PUSHER_SECRET || "dummy-secret",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
    useTLS: true,
});
