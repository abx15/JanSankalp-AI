import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class AgentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly aiBaseUrl;
    private readonly internalToken;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(data: {
        message: string;
        history?: any[];
    }, client: Socket): Promise<void>;
}
