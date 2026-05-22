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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const workflows_service_1 = require("./workflows.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let WorkflowsController = class WorkflowsController {
    constructor(workflowsService) {
        this.workflowsService = workflowsService;
    }
    async getComplaints(status, category, severity, authorId, assignedToId, districtId, limit, cursor) {
        return this.workflowsService.getComplaints({
            status,
            category,
            severity,
            authorId,
            assignedToId,
            districtId,
            limit,
            cursor,
        });
    }
    async getComplaintById(id) {
        return this.workflowsService.getComplaintById(id);
    }
    async createComplaint(body, req) {
        const authorId = req.user.id;
        return this.workflowsService.createComplaint({ ...body, authorId });
    }
    async assignComplaint(body, req) {
        const { complaintId, officerId } = body;
        return this.workflowsService.assignComplaint(complaintId, officerId, req.user);
    }
    async updateComplaint(id, body, req) {
        return this.workflowsService.updateComplaint(id, body, req.user);
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Get)('complaints'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('severity')),
    __param(3, (0, common_1.Query)('authorId')),
    __param(4, (0, common_1.Query)('assignedToId')),
    __param(5, (0, common_1.Query)('districtId')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getComplaints", null);
__decorate([
    (0, common_1.Get)('complaints/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "getComplaintById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('complaints'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "createComplaint", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.STATE_ADMIN, client_1.Role.DISTRICT_ADMIN),
    (0, common_1.Post)('complaints/assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "assignComplaint", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.OFFICER, client_1.Role.ADMIN),
    (0, common_1.Put)('complaints/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkflowsController.prototype, "updateComplaint", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, common_1.Controller)('workflows'),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService])
], WorkflowsController);
//# sourceMappingURL=workflows.controller.js.map