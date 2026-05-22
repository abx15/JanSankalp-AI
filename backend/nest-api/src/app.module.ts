import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { AgentsModule } from './agents/agents.module';
import { QueueModule } from './queue/queue.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    WorkflowsModule,
    AgentsModule,
    QueueModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
