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
exports.WorkflowProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const prisma_service_1 = require("../../database/prisma.service");
const agents_service_1 = require("../../agents/agents.service");
const ioredis_1 = require("ioredis");
let WorkflowProcessor = class WorkflowProcessor {
    constructor(prisma, agentsService) {
        this.prisma = prisma;
        this.agentsService = agentsService;
    }
    onModuleInit() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.redisConnection = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
        });
        this.worker = new bullmq_1.Worker('workflow-queue', async (job) => {
            const { complaintId, text, latitude, longitude } = job.data;
            console.log(`[BULLMQ] Processing job ${job.id} for complaint ID ${complaintId}...`);
            try {
                const aiResult = await this.agentsService.processWorkflow(complaintId, text, latitude, longitude);
                console.log(`[BULLMQ] FastAPI workflow response for ${complaintId}:`, aiResult);
                const isSpam = aiResult.is_spam || false;
                const isDuplicate = aiResult.is_duplicate || false;
                const analysis = aiResult.analysis || {};
                const category = analysis.category || 'General';
                const confidenceScore = analysis.confidence || 0.8;
                const spamScore = isSpam ? 1.0 : (aiResult.spam_score || 0.0);
                const rawSeverity = (analysis.severity || 'Medium').toLowerCase();
                let severity = 3;
                if (rawSeverity === 'low') {
                    severity = 1;
                }
                else if (rawSeverity === 'medium') {
                    severity = 3;
                }
                else if (rawSeverity === 'high') {
                    severity = 4;
                }
                else if (rawSeverity === 'critical') {
                    severity = 5;
                }
                let status = 'PENDING';
                let departmentId = null;
                let assignedToId = null;
                if (isSpam) {
                    status = 'REJECTED';
                    console.log(`[BULLMQ] Complaint ${complaintId} flagged as SPAM. Status marked as REJECTED.`);
                }
                else if (isDuplicate) {
                    status = 'REJECTED';
                    console.log(`[BULLMQ] Complaint ${complaintId} flagged as DUPLICATE. Status marked as REJECTED.`);
                }
                else {
                    status = 'IN_PROGRESS';
                    const assignedDeptName = aiResult.assigned_department || category;
                    if (assignedDeptName) {
                        const dbDept = await this.prisma.department.findFirst({
                            where: {
                                name: {
                                    contains: assignedDeptName,
                                    mode: 'insensitive',
                                },
                            },
                        });
                        if (dbDept) {
                            departmentId = dbDept.id;
                            console.log(`[BULLMQ] Matched department: ${dbDept.name} (${dbDept.id})`);
                            if (dbDept.headId) {
                                assignedToId = dbDept.headId;
                                console.log(`[BULLMQ] Routed to Department Head Officer ID: ${assignedToId}`);
                            }
                            else {
                                const fallbackOfficer = await this.prisma.user.findFirst({
                                    where: { role: 'OFFICER' },
                                });
                                if (fallbackOfficer) {
                                    assignedToId = fallbackOfficer.id;
                                    console.log(`[BULLMQ] Routing to fallback Officer ID: ${assignedToId}`);
                                }
                            }
                        }
                        else {
                            const firstDept = await this.prisma.department.findFirst();
                            if (firstDept) {
                                departmentId = firstDept.id;
                                if (firstDept.headId) {
                                    assignedToId = firstDept.headId;
                                }
                                console.log(`[BULLMQ] Fallback routing to first department: ${firstDept.name} (${firstDept.id})`);
                            }
                        }
                    }
                }
                await this.prisma.complaint.update({
                    where: { id: complaintId },
                    data: {
                        status: status,
                        severity,
                        category,
                        confidenceScore,
                        spamScore,
                        isDuplicate,
                        departmentId,
                        assignedToId,
                        aiAnalysis: aiResult,
                    },
                });
                console.log(`[BULLMQ] Successfully completed background processing for complaint ${complaintId}`);
                return { success: true, complaintId };
            }
            catch (err) {
                console.error(`[BULLMQ] Failed to process job ${job.id}:`, err);
                throw err;
            }
        }, {
            connection: this.redisConnection,
            concurrency: 5,
        });
        this.worker.on('completed', (job) => {
            console.log(`[BULLMQ] Job ${job.id} completed successfully`);
        });
        this.worker.on('failed', (job, err) => {
            console.error(`[BULLMQ] Job ${job.id} failed with error:`, err);
        });
    }
    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
        }
        if (this.redisConnection) {
            await this.redisConnection.quit();
        }
    }
};
exports.WorkflowProcessor = WorkflowProcessor;
exports.WorkflowProcessor = WorkflowProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        agents_service_1.AgentsService])
], WorkflowProcessor);
//# sourceMappingURL=workflow.processor.js.map