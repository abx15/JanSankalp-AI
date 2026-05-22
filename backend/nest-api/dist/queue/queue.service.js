"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
let QueueService = class QueueService {
    onModuleInit() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.redisConnection = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
        });
        this.workflowQueue = new bullmq_1.Queue('workflow-queue', {
            connection: this.redisConnection,
        });
    }
    async addWorkflowJob(complaintId, text, latitude, longitude) {
        const job = await this.workflowQueue.add('process-workflow', { complaintId, text, latitude, longitude }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
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
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)()
], QueueService);
//# sourceMappingURL=queue.service.js.map