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
exports.ThreatLogSchema = exports.ThreatLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ThreatLog = class ThreatLog extends mongoose_2.Document {
};
exports.ThreatLog = ThreatLog;
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], ThreatLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], ThreatLog.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], ThreatLog.prototype, "threatType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ThreatLog.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ThreatLog.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ThreatLog.prototype, "blocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ThreatLog.prototype, "geoInfo", void 0);
exports.ThreatLog = ThreatLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ThreatLog);
exports.ThreatLogSchema = mongoose_1.SchemaFactory.createForClass(ThreatLog);
//# sourceMappingURL=threat.schema.js.map