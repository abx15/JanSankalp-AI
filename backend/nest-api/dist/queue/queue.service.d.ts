import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class QueueService implements OnModuleInit, OnModuleDestroy {
    private workflowQueue;
    private redisConnection;
    onModuleInit(): void;
    addWorkflowJob(complaintId: string, text: string, latitude: number, longitude: number): Promise<import("bullmq").Job<any, any, string>>;
    onModuleDestroy(): Promise<void>;
}
