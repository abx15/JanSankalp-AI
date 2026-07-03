import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/conversation.schema';
import { ThreatLog, ThreatLogSchema } from './schemas/threat.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit.schema';
import { TelemetryLog, TelemetryLogSchema } from './schemas/telemetry.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.url'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ThreatLog.name, schema: ThreatLogSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: TelemetryLog.name, schema: TelemetryLogSchema },
    ]),
  ],
  providers: [PrismaService],
  exports: [PrismaService, MongooseModule],
})
export class DatabaseModule {}
