import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { AgentsService } from '../../agents/agents.service';
import Redis from 'ioredis';

@Injectable()
export class WorkflowProcessor implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;
  private redisConnection: Redis;

  constructor(
    private prisma: PrismaService,
    private agentsService: AgentsService,
  ) {}

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'workflow-queue',
      async (job: Job) => {
        const { complaintId, text, latitude, longitude } = job.data;
        console.log(`[BULLMQ] Processing job ${job.id} for complaint ID ${complaintId}...`);

        try {
          // Call the multi-agent autonomous workflow in fastapi-ai
          const aiResult = await this.agentsService.processWorkflow(complaintId, text, latitude, longitude);
          
          console.log(`[BULLMQ] FastAPI workflow response for ${complaintId}:`, aiResult);

          // Extract analysis parameters securely
          const isSpam = aiResult.is_spam || false;
          const isDuplicate = aiResult.is_duplicate || false;
          const analysis = aiResult.analysis || {};
          
          // Map category & confidence
          const category = analysis.category || 'General';
          const confidenceScore = analysis.confidence || 0.8;
          const spamScore = isSpam ? 1.0 : (aiResult.spam_score || 0.0);

          // Map severity level string (Low, Medium, High, Critical) to integer scale 1-5
          const rawSeverity = (analysis.severity || 'Medium').toLowerCase();
          let severity = 3; // Fallback to 3 (Medium)
          if (rawSeverity === 'low') {
            severity = 1;
          } else if (rawSeverity === 'medium') {
            severity = 3;
          } else if (rawSeverity === 'high') {
            severity = 4;
          } else if (rawSeverity === 'critical') {
            severity = 5;
          }

          // Initial status logic based on spam/duplicate checks
          let status = 'PENDING';
          let departmentId = null;
          let assignedToId = null;

          if (isSpam) {
            status = 'REJECTED';
            console.log(`[BULLMQ] Complaint ${complaintId} flagged as SPAM. Status marked as REJECTED.`);
          } else if (isDuplicate) {
            status = 'REJECTED';
            console.log(`[BULLMQ] Complaint ${complaintId} flagged as DUPLICATE. Status marked as REJECTED.`);
          } else {
            // Unique, valid complaint. Proceed to execute automated routing!
            status = 'IN_PROGRESS'; // Mark as in progress since it is active and routed
            
            // 1. Department Routing
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
                
                // 2. Officer Routing
                if (dbDept.headId) {
                  assignedToId = dbDept.headId;
                  console.log(`[BULLMQ] Routed to Department Head Officer ID: ${assignedToId}`);
                } else {
                  // Fallback: Find any active Officer
                  const fallbackOfficer = await this.prisma.user.findFirst({
                    where: { role: 'OFFICER' },
                  });
                  if (fallbackOfficer) {
                    assignedToId = fallbackOfficer.id;
                    console.log(`[BULLMQ] Routing to fallback Officer ID: ${assignedToId}`);
                  }
                }
              } else {
                // If department not matched by name, find the first available department
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

          // Update complaint details in the database
          await this.prisma.complaint.update({
            where: { id: complaintId },
            data: {
              status: status as any,
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
        } catch (err) {
          console.error(`[BULLMQ] Failed to process job ${job.id}:`, err);
          throw err;
        }
      },
      {
        connection: this.redisConnection,
        concurrency: 5, // Process up to 5 concurrent LLM workflow tasks
      },
    );

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
}
