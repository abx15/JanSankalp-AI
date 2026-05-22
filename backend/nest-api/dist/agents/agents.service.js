"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
let AgentsService = class AgentsService {
    constructor() {
        this.aiBaseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        this.internalToken = process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026';
    }
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.internalToken}`,
        };
    }
    async chat(message, history) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/chat`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ message, history }),
            });
            if (!resp.ok) {
                throw new Error(`AI service responded with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Chat failed:', err);
            throw new common_1.InternalServerErrorException('AI chat service is temporarily unavailable');
        }
    }
    async classify(text) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/classify`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ text }),
            });
            if (!resp.ok) {
                throw new Error(`AI service responded with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Classify failed:', err);
            throw new common_1.InternalServerErrorException('AI classification service is temporarily unavailable');
        }
    }
    async checkDuplicate(text, latitude, longitude) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/duplicate-check`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ text, latitude, longitude }),
            });
            if (!resp.ok) {
                throw new Error(`AI service responded with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Duplicate check failed:', err);
            throw new common_1.InternalServerErrorException('AI duplicate checking is temporarily unavailable');
        }
    }
    async checkSpam(text) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/spam-check`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ text }),
            });
            if (!resp.ok) {
                throw new Error(`AI service responded with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Spam check failed:', err);
            throw new common_1.InternalServerErrorException('AI spam analysis is temporarily unavailable');
        }
    }
    async processWorkflow(complaintId, text, latitude, longitude) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/process-workflow`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ complaint_id: complaintId, text, latitude, longitude }),
            });
            if (!resp.ok) {
                throw new Error(`AI workflow execution failed with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Workflow execution failed:', err);
            throw new common_1.InternalServerErrorException('AI multi-agent workflow is temporarily unavailable');
        }
    }
    async assistantChat(userId, message, role, context) {
        try {
            const resp = await fetch(`${this.aiBaseUrl}/assistant/chat`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ user_id: userId, message, role, context }),
            });
            if (!resp.ok) {
                throw new Error(`AI assistant responded with status ${resp.status}`);
            }
            return await resp.json();
        }
        catch (err) {
            console.error('[AGENTS-SERVICE] Assistant chat failed:', err);
            throw new common_1.InternalServerErrorException('AI assistant service is temporarily unavailable');
        }
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)()
], AgentsService);
//# sourceMappingURL=agents.service.js.map