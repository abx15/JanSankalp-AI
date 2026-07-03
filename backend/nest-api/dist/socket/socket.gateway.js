"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsGateway = exports.DashboardGateway = exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let BaseGateway = class BaseGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        const token = client.handshake.auth?.token ||
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
        }
        catch (err) {
            console.log(`[WS] Connection rejected: Invalid token for client ${client.id}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        console.log(`[WS] Client disconnected: ${client.id}`);
    }
};
BaseGateway = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], BaseGateway);
let NotificationsGateway = class NotificationsGateway extends BaseGateway {
    constructor(jwtService) {
        super(jwtService);
    }
    async handleConnection(client) {
        await super.handleConnection(client);
        if (client.data?.userId) {
            const roomName = `user-${client.data.userId}`;
            client.join(roomName);
            console.log(`[WS-Notifications] Client ${client.id} joined personal room: ${roomName}`);
        }
    }
    sendToUser(userId, event, data) {
        const roomName = `user-${userId}`;
        this.server.to(roomName).emit(event, data);
        console.log(`[WS-Notifications] Dispatched event "${event}" to room "${roomName}"`);
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
let DashboardGateway = class DashboardGateway extends BaseGateway {
    constructor(jwtService) {
        super(jwtService);
    }
    handleSubscribeStats(client) {
        client.join('dashboard-stats');
        console.log(`[WS-Dashboard] Client ${client.id} subscribed to live statistics updates`);
    }
    broadcastStats(stats) {
        this.server.to('dashboard-stats').emit('statsUpdate', stats);
    }
    broadcastComplaintUpdate(data) {
        this.server.emit('complaintUpdate', data);
    }
};
exports.DashboardGateway = DashboardGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DashboardGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeStats'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DashboardGateway.prototype, "handleSubscribeStats", null);
exports.DashboardGateway = DashboardGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'dashboard',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], DashboardGateway);
let IncidentsGateway = class IncidentsGateway extends BaseGateway {
    constructor(jwtService) {
        super(jwtService);
    }
    handleJoinDistrict(data, client) {
        if (data.districtId) {
            const room = `district-${data.districtId}`;
            client.join(room);
            console.log(`[WS-Incidents] Client ${client.id} joined district room: ${room}`);
        }
    }
    handleJoinDepartment(data, client) {
        if (data.departmentId) {
            const room = `dept-${data.departmentId}`;
            client.join(room);
            console.log(`[WS-Incidents] Client ${client.id} joined department room: ${room}`);
        }
    }
    dispatchNewIncident(districtId, departmentId, incident) {
        if (districtId) {
            this.server.to(`district-${districtId}`).emit('newIncident', incident);
        }
        if (departmentId) {
            this.server.to(`dept-${departmentId}`).emit('newIncident', incident);
        }
        this.server.emit('incidentUpdate', incident);
    }
};
exports.IncidentsGateway = IncidentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], IncidentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinDistrict'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IncidentsGateway.prototype, "handleJoinDistrict", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinDepartment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], IncidentsGateway.prototype, "handleJoinDepartment", null);
exports.IncidentsGateway = IncidentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'incidents',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], IncidentsGateway);
//# sourceMappingURL=socket.gateway.js.map