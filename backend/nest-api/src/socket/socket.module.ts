import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  NotificationsGateway,
  DashboardGateway,
  IncidentsGateway,
} from './socket.gateway';
import { RedisSubscriberService } from './redis-subscriber.service';

@Module({
  imports: [AuthModule],
  providers: [NotificationsGateway, DashboardGateway, IncidentsGateway, RedisSubscriberService],
  exports: [NotificationsGateway, DashboardGateway, IncidentsGateway],
})
export class SocketModule {}
