import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UseFilters } from '@nestjs/common';

@Injectable()
class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(protected jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      console.log(`[WS] Connection rejected: Missing token for client ${client.id}`);
      client.disconnect(true);
      return;
    }

    try {
      const secret = process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure';
      const payload = this.jwtService.verify(token, { secret });
      client.data = { userId: payload.sub };
      console.log(`[WS] Client authenticated: ${client.id} (User: ${payload.sub})`);
    } catch (err) {
      console.log(`[WS] Connection rejected: Invalid token for client ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS] Client disconnected: ${client.id}`);
  }
}

// ─── 1. Notifications Namespace ─────────────────────────────────────────────
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'notifications',
})
export class NotificationsGateway extends BaseGateway {
  @WebSocketServer()
  server: Server;

  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  async handleConnection(client: Socket) {
    await super.handleConnection(client);
    if (client.data?.userId) {
      const roomName = `user-${client.data.userId}`;
      client.join(roomName);
      console.log(`[WS-Notifications] Client ${client.id} joined personal room: ${roomName}`);
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const roomName = `user-${userId}`;
    this.server.to(roomName).emit(event, data);
    console.log(`[WS-Notifications] Dispatched event "${event}" to room "${roomName}"`);
  }
}

// ─── 2. Dashboard Namespace ─────────────────────────────────────────────────
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'dashboard',
})
export class DashboardGateway extends BaseGateway {
  @WebSocketServer()
  server: Server;

  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  @SubscribeMessage('subscribeStats')
  handleSubscribeStats(@ConnectedSocket() client: Socket) {
    client.join('dashboard-stats');
    console.log(`[WS-Dashboard] Client ${client.id} subscribed to live statistics updates`);
  }

  broadcastStats(stats: any) {
    this.server.to('dashboard-stats').emit('statsUpdate', stats);
  }

  broadcastComplaintUpdate(data: any) {
    this.server.emit('complaintUpdate', data);
  }
}

// ─── 3. Incidents Namespace (For Officers and Admins) ───────────────────────
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'incidents',
})
export class IncidentsGateway extends BaseGateway {
  @WebSocketServer()
  server: Server;

  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  @SubscribeMessage('joinDistrict')
  handleJoinDistrict(
    @MessageBody() data: { districtId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.districtId) {
      const room = `district-${data.districtId}`;
      client.join(room);
      console.log(`[WS-Incidents] Client ${client.id} joined district room: ${room}`);
    }
  }

  @SubscribeMessage('joinDepartment')
  handleJoinDepartment(
    @MessageBody() data: { departmentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.departmentId) {
      const room = `dept-${data.departmentId}`;
      client.join(room);
      console.log(`[WS-Incidents] Client ${client.id} joined department room: ${room}`);
    }
  }

  dispatchNewIncident(districtId: string, departmentId: string, incident: any) {
    if (districtId) {
      this.server.to(`district-${districtId}`).emit('newIncident', incident);
    }
    if (departmentId) {
      this.server.to(`dept-${departmentId}`).emit('newIncident', incident);
    }
    // Also send to all connected administrators
    this.server.emit('incidentUpdate', incident);
  }
}
