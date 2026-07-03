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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryLogSchema = exports.TelemetryLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TelemetryLog = class TelemetryLog extends mongoose_2.Document {
};
exports.TelemetryLog = TelemetryLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TelemetryLog.prototype, "sensorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TelemetryLog.prototype, "sensorType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TelemetryLog.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TelemetryLog.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], TelemetryLog.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], TelemetryLog.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'OPERATIONAL' }),
    __metadata("design:type", String)
], TelemetryLog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], TelemetryLog.prototype, "metadata", void 0);
exports.TelemetryLog = TelemetryLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TelemetryLog);
exports.TelemetryLogSchema = mongoose_1.SchemaFactory.createForClass(TelemetryLog);
//# sourceMappingURL=telemetry.schema.js.map