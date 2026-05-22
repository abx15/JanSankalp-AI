import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private workflowQueue: Queue;
  private redisConnection: Redis;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    this.workflowQueue = new Queue('workflow-queue', {
      connection: this.redisConnection,
    });
  }

  async addWorkflowJob(complaintId: string, text: string, latitude: number, longitude: number) {
    const job = await this.workflowQueue.add(
      'process-workflow',
      { complaintId, text, latitude, longitude },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // Wait 5s before retrying
        },
      },
    );
    console.log(`[BULLMQ] Enqueued workflow job ${job.id} for complaint ${complaintId}`);
    return job;
  }

  async onModuleDestroy() {
    if (this.workflowQueue) {
      await this.workflowQueue.close();
    }
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
  }
}
