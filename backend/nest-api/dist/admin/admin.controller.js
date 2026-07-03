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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async getAnalytics(req) {
        return this.adminService.getAnalytics(req.user);
    }
    async getAiStats() {
        return this.adminService.getAiStats();
    }
    async triggerAiProcess() {
        return this.adminService.triggerAiProcess();
    }
    async getDepartments() {
        return this.adminService.getDepartments();
    }
    async createDepartment(body) {
        return this.adminService.createDepartment(body);
    }
    async updateDepartment(id, body) {
        return this.adminService.updateDepartment(id, body);
    }
    async deleteDepartment(id) {
        return this.adminService.deleteDepartment(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.STATE_ADMIN, client_1.Role.DISTRICT_ADMIN, client_1.Role.CITY_ADMIN),
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('ai-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAiStats", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)('ai-process'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "triggerAiProcess", null);
__decorate([
    (0, common_1.Get)('departments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDepartments", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)('departments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDepartment", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Put)('departments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDepartment", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Delete)('departments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDepartment", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map