"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
exports.redisClient = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
});
exports.redisClient.on('connect', () => {
    console.log(`[Redis] Connected successfully to Redis server at ${redisUrl}`);
});
exports.redisClient.on('error', (err) => {
    console.error('[Redis] Connection error:', err);
});
const publishEvent = async (channel, event, payload) => {
    try {
        const data = JSON.stringify({ channel, event, payload });
        await exports.redisClient.publish('realtime-events', data);
        console.log(`[Redis Pub] Published event "${event}" to channel "${channel}" via Redis pub/sub`);
    }
    catch (err) {
        console.error('[Redis Pub] Failed to publish event:', err);
    }
};
exports.publishEvent = publishEvent;
