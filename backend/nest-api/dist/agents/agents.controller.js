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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("./agents.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async chat(body) {
        const { message, history } = body;
        return this.agentsService.chat(message, history || []);
    }
    async classify(body) {
        return this.agentsService.classify(body.text);
    }
    async checkDuplicate(body) {
        const { text, latitude, longitude } = body;
        return this.agentsService.checkDuplicate(text, latitude, longitude);
    }
    async checkSpam(body) {
        return this.agentsService.checkSpam(body.text);
    }
    async processWorkflow(body) {
        const { complaintId, text, latitude, longitude } = body;
        return this.agentsService.processWorkflow(complaintId, text, latitude, longitude);
    }
    async assistantChat(body, req) {
        const { message, context } = body;
        const userId = req.user.id;
        const role = req.user.role;
        return this.agentsService.assistantChat(userId, message, role, context);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('classify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "classify", null);
__decorate([
    (0, common_1.Post)('duplicate-check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "checkDuplicate", null);
__decorate([
    (0, common_1.Post)('spam-check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "checkSpam", null);
__decorate([
    (0, common_1.Post)('process-workflow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "processWorkflow", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('assistant/chat'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "assistantChat", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map