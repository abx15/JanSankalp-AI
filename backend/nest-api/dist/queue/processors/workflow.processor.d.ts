import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AgentsService } from '../../agents/agents.service';
export declare class WorkflowProcessor implements OnModuleInit, OnModuleDestroy {
    private prisma;
    private agentsService;
    private worker;
    private redisConnection;
    constructor(prisma: PrismaService, agentsService: AgentsService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
}
