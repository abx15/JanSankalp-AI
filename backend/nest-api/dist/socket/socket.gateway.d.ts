import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
declare class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    protected jwtService: JwtService;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
}
export declare class NotificationsGateway extends BaseGateway {
    server: Server;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    sendToUser(userId: string, event: string, data: any): void;
}
export declare class DashboardGateway extends BaseGateway {
    server: Server;
    constructor(jwtService: JwtService);
    handleSubscribeStats(client: Socket): void;
    broadcastStats(stats: any): void;
    broadcastComplaintUpdate(data: any): void;
}
export declare class IncidentsGateway extends BaseGateway {
    server: Server;
    constructor(jwtService: JwtService);
    handleJoinDistrict(data: {
        districtId: string;
    }, client: Socket): void;
    handleJoinDepartment(data: {
        departmentId: string;
    }, client: Socket): void;
    dispatchNewIncident(districtId: string, departmentId: string, incident: any): void;
}
export {};
