import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log(`[Redis] Connected successfully to Redis server at ${redisUrl}`);
});

redisClient.on('error', (err) => {
  console.error('[Redis] Connection error:', err);
});

export const publishEvent = async (channel: string, event: string, payload: any) => {
  try {
    const data = JSON.stringify({ channel, event, payload });
    await redisClient.publish('realtime-events', data);
    console.log(`[Redis Pub] Published event "${event}" to channel "${channel}" via Redis pub/sub`);
  } catch (err) {
    console.error('[Redis Pub] Failed to publish event:', err);
  }
};
