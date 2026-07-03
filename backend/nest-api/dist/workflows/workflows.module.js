"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsModule = void 0;
const common_1 = require("@nestjs/common");
const workflows_service_1 = require("./workflows.service");
const workflows_controller_1 = require("./workflows.controller");
const auth_module_1 = require("../auth/auth.module");
const socket_module_1 = require("../socket/socket.module");
let WorkflowsModule = class WorkflowsModule {
};
exports.WorkflowsModule = WorkflowsModule;
exports.WorkflowsModule = WorkflowsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, socket_module_1.SocketModule],
        controllers: [workflows_controller_1.WorkflowsController],
        providers: [workflows_service_1.WorkflowsService],
        exports: [workflows_service_1.WorkflowsService],
    })
], WorkflowsModule);
//# sourceMappingURL=workflows.module.js.map