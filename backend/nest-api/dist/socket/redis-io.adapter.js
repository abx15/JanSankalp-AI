"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = require("ioredis");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    async connectToRedis() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        const pubClient = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
        });
        const subClient = pubClient.duplicate();
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
        console.log(`[RedisIoAdapter] Connected to Redis for WebSockets scaling at ${redisUrl}`);
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map