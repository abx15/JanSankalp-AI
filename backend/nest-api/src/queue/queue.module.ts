import { Module, Global } from '@nestjs/common';
import { QueueService } from './queue.service';
import { WorkflowProcessor } from './processors/workflow.processor';
import { AgentsModule } from '../agents/agents.module';

@Global()
@Module({
  imports: [AgentsModule],
  providers: [QueueService, WorkflowProcessor],
  exports: [QueueService],
})
export class QueueModule {}
