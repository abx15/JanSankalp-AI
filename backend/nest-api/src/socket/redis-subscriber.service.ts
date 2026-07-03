import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationsGateway, DashboardGateway, IncidentsGateway } from './socket.gateway';

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private redisSub: Redis;

  constructor(
    private notificationsGateway: NotificationsGateway,
    private dashboardGateway: DashboardGateway,
    private incidentsGateway: IncidentsGateway,
  ) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redisSub = new Redis(redisUrl, {
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

  private handleRealtimeEvent(message: string) {
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
      } else if (channel.startsWith('user-')) {
        const userId = channel.replace('user-', '');
        this.notificationsGateway.sendToUser(userId, 'notification', payload);
      }
    } catch (err) {
      console.error('[RedisSubscriber] Failed to parse and route pub/sub message:', err);
    }
  }

  async onModuleDestroy() {
    if (this.redisSub) {
      await this.redisSub.quit();
      console.log('[RedisSubscriber] Disconnected from Redis');
    }
  }
}
