"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSubscriberService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const socket_gateway_1 = require("./socket.gateway");
let RedisSubscriberService = class RedisSubscriberService {
    constructor(notificationsGateway, dashboardGateway, incidentsGateway) {
        this.notificationsGateway = notificationsGateway;
        this.dashboardGateway = dashboardGateway;
        this.incidentsGateway = incidentsGateway;
    }
    async onModuleInit() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.redisSub = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
        });
        this.redisSub.on('connect', () => {
            console.log(`[RedisSubscriber] Connected to Redis for pub/sub at ${redisUrl}`);
        });
        this.redisSub.on('error', (err) => {
            console.error('[RedisSubscriber] Connection error:', err);
        });
        await this.redisSub.subscribe('realtime-events');
        console.log('[RedisSubscriber] Subscribed to "realtime-events" channel');
        this.redisSub.on('message', (channel, message) => {
            if (channel === 'realtime-events') {
                this.handleRealtimeEvent(message);
            }
        });
    }
    handleRealtimeEvent(message) {
        try {
            const { channel, event, payload } = JSON.parse(message);
            console.log(`[RedisSubscriber] Received event: Channel="${channel}" Event="${event}"`, payload);
            if (channel === 'governance-channel') {
                if (event === 'new-complaint' || event === 'complaint-updated') {
                    this.dashboardGateway.broadcastComplaintUpdate({ event, ...payload });
                    if (event === 'new-complaint') {
                        this.incidentsGateway.dispatchNewIncident(payload.districtId, payload.departmentId, payload);
                    }
                }
            }
            else if (channel.startsWith('user-')) {
                const userId = channel.replace('user-', '');
                this.notificationsGateway.sendToUser(userId, 'notification', payload);
            }
        }
        catch (err) {
            console.error('[RedisSubscriber] Failed to parse and route pub/sub message:', err);
        }
    }
    async onModuleDestroy() {
        if (this.redisSub) {
            await this.redisSub.quit();
            console.log('[RedisSubscriber] Disconnected from Redis');
        }
    }
};
exports.RedisSubscriberService = RedisSubscriberService;
exports.RedisSubscriberService = RedisSubscriberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [socket_gateway_1.NotificationsGateway,
        socket_gateway_1.DashboardGateway,
        socket_gateway_1.IncidentsGateway])
], RedisSubscriberService);
//# sourceMappingURL=redis-subscriber.service.js.map