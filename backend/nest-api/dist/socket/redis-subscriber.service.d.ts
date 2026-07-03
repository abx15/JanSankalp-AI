import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationsGateway, DashboardGateway, IncidentsGateway } from './socket.gateway';
export declare class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
    private notificationsGateway;
    private dashboardGateway;
    private incidentsGateway;
    private redisSub;
    constructor(notificationsGateway: NotificationsGateway, dashboardGateway: DashboardGateway, incidentsGateway: IncidentsGateway);
    onModuleInit(): Promise<void>;
    private handleRealtimeEvent;
    onModuleDestroy(): Promise<void>;
}
