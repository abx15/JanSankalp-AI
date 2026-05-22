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
exports.AgentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let AgentsGateway = class AgentsGateway {
    constructor() {
        this.aiBaseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        this.internalToken = process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026';
    }
    handleConnection(client) {
        console.log(`[WS-AGENTS] Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`[WS-AGENTS] Client disconnected: ${client.id}`);
    }
    async handleMessage(data, client) {
        try {
            const { message, history = [] } = data;
            const response = await fetch(`${this.aiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.internalToken}`,
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ message, history, stream: true }),
            });
            if (!response.ok || !response.body) {
                client.emit('chatError', 'Failed to initialize streaming connection with AI engine');
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed)
                        continue;
                    if (trimmed.startsWith('data:')) {
                        const dataContent = trimmed.substring(5).trim();
                        if (dataContent === '[DONE]') {
                            client.emit('chatDone');
                        }
                        else {
                            try {
                                const parsed = JSON.parse(dataContent);
                                client.emit('chatChunk', parsed);
                            }
                            catch (e) {
                                client.emit('chatChunk', { content: dataContent });
                            }
                        }
                    }
                }
            }
            if (buffer.trim()) {
                client.emit('chatChunk', { content: buffer });
            }
            client.emit('chatDone');
        }
        catch (err) {
            console.error('[WS-AGENTS] Error streaming:', err);
            client.emit('chatError', 'An error occurred during response generation');
        }
    }
};
exports.AgentsGateway = AgentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AgentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AgentsGateway.prototype, "handleMessage", null);
exports.AgentsGateway = AgentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'agents',
    })
], AgentsGateway);
//# sourceMappingURL=agents.gateway.js.map