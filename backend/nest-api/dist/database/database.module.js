"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma.service");
const conversation_schema_1 = require("./schemas/conversation.schema");
const conversation_schema_2 = require("./schemas/conversation.schema");
const threat_schema_1 = require("./schemas/threat.schema");
const audit_schema_1 = require("./schemas/audit.schema");
const telemetry_schema_1 = require("./schemas/telemetry.schema");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.get('mongodb.url'),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: conversation_schema_1.Conversation.name, schema: conversation_schema_1.ConversationSchema },
                { name: conversation_schema_2.Message.name, schema: conversation_schema_2.MessageSchema },
                { name: threat_schema_1.ThreatLog.name, schema: threat_schema_1.ThreatLogSchema },
                { name: audit_schema_1.AuditLog.name, schema: audit_schema_1.AuditLogSchema },
                { name: telemetry_schema_1.TelemetryLog.name, schema: telemetry_schema_1.TelemetryLogSchema },
            ]),
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService, mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map