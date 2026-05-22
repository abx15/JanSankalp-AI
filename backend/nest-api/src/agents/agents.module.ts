import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { AgentsGateway } from './agents.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AgentsController],
  providers: [AgentsService, AgentsGateway],
  exports: [AgentsService, AgentsGateway],
})
export class AgentsModule {}
