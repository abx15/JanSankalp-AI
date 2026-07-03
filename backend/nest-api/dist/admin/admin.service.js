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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_schema_1 = require("../database/schemas/audit.schema");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
let AdminService = class AdminService {
    constructor(prisma, configService, auditLogModel) {
        this.prisma = prisma;
        this.configService = configService;
        this.auditLogModel = auditLogModel;
    }
    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const totalAdmins = await this.prisma.user.count({ where: { role: client_1.Role.ADMIN } });
        const totalOfficers = await this.prisma.user.count({ where: { role: client_1.Role.OFFICER } });
        const totalCitizens = await this.prisma.user.count({ where: { role: client_1.Role.CITIZEN } });
        const verifiedUsers = await this.prisma.user.count({ where: { emailVerified: { not: null } } });
        const unverifiedUsers = await this.prisma.user.count({ where: { emailVerified: null } });
        const totalComplaints = await this.prisma.complaint.count();
        const pendingComplaints = await this.prisma.complaint.count({ where: { status: client_1.ComplaintStatus.PENDING } });
        const inProgressComplaints = await this.prisma.complaint.count({ where: { status: client_1.ComplaintStatus.IN_PROGRESS } });
        const resolvedComplaints = await this.prisma.complaint.count({ where: { status: client_1.ComplaintStatus.RESOLVED } });
        const rejectedComplaints = await this.prisma.complaint.count({ where: { status: client_1.ComplaintStatus.REJECTED } });
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLogins = await this.auditLogModel.countDocuments({
            action: 'USER_LOGIN',
            createdAt: { $gte: twentyFourHoursAgo },
        });
        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const newUsersThisMonth = await this.prisma.user.count({
            where: {
                createdAt: { gte: thisMonthStart },
            },
        });
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUsersLast7Days = await this.auditLogModel.countDocuments({
            action: { $in: ['USER_LOGIN', 'COMPLAINT_CREATED', 'COMPLAINT_RESOLVED'] },
            createdAt: { $gte: sevenDaysAgo },
        });
        const departments = await this.prisma.department.findMany({
            include: {
                _count: {
                    select: { complaints: true },
                },
            },
        });
        return {
            overview: {
                totalUsers,
                totalAdmins,
                totalOfficers,
                totalCitizens,
                verifiedUsers,
                unverifiedUsers,
                totalComplaints,
                pendingComplaints,
                inProgressComplaints,
                resolvedComplaints,
                rejectedComplaints,
                recentLogins,
                newUsersThisMonth,
                activeUsersLast7Days,
            },
            departments: departments.map((dept) => ({
                id: dept.id,
                name: dept.name,
                complaintsCount: dept._count.complaints,
                head: dept.headId,
            })),
        };
    }
    async getAnalytics(user) {
        const tenantFilter = {};
        if (user.role === client_1.Role.STATE_ADMIN)
            tenantFilter.stateId = user.stateId;
        if (user.role === client_1.Role.DISTRICT_ADMIN)
            tenantFilter.districtId = user.districtId;
        if (user.role === client_1.Role.CITY_ADMIN)
            tenantFilter.cityId = user.cityId;
        if (user.role === client_1.Role.OFFICER)
            tenantFilter.districtId = user.districtId;
        const userRoleCounts = await this.prisma.user.groupBy({
            by: ['role'],
            where: tenantFilter,
            _count: true,
        });
        const statusCounts = await this.prisma.complaint.groupBy({
            by: ['status'],
            where: tenantFilter,
            _count: true,
        });
        const categoryCounts = await this.prisma.complaint.groupBy({
            by: ['category'],
            where: tenantFilter,
            _count: true,
            orderBy: {
                _count: {
                    category: 'desc',
                },
            },
            take: 10,
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        let rawTrends = [];
        if (user.stateId || user.districtId || user.cityId) {
            const filters = [];
            if (user.stateId)
                filters.push(`"stateId" = '${user.stateId}'`);
            if (user.districtId)
                filters.push(`"districtId" = '${user.districtId}'`);
            if (user.cityId)
                filters.push(`"cityId" = '${user.cityId}'`);
            const rawQuery = `
        SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*)::integer as count
        FROM "Complaint"
        WHERE "createdAt" >= $1 AND ${filters.join(' AND ')}
        GROUP BY day
        ORDER BY day ASC
      `;
            rawTrends = await this.prisma.$queryRawUnsafe(rawQuery, sevenDaysAgo);
        }
        else {
            rawTrends = await this.prisma.$queryRaw `
        SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*)::integer as count
        FROM "Complaint"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY day
        ORDER BY day ASC
      `;
        }
        const dailyTrendMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyTrendMap[d.toISOString().split('T')[0]] = 0;
        }
        rawTrends.forEach((t) => {
            const dateStr = new Date(t.day).toISOString().split('T')[0];
            if (dailyTrendMap[dateStr] !== undefined) {
                dailyTrendMap[dateStr] = t.count;
            }
        });
        const formattedTrends = Object.entries(dailyTrendMap)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => a.day.localeCompare(b.day));
        const severityCounts = await this.prisma.complaint.groupBy({
            where: tenantFilter,
            by: ['severity'],
            _count: true,
        });
        const deptActivity = await this.prisma.department.findMany({
            select: {
                name: true,
                _count: {
                    select: {
                        complaints: {
                            where: tenantFilter,
                        },
                    },
                },
            },
            orderBy: {
                complaints: {
                    _count: 'desc',
                },
            },
            take: 5,
        });
        const aiInsights = {
            hotspots: categoryCounts.slice(0, 3).map((c) => c.category),
            summary: `Automated scan detected patterns in ${categoryCounts[0]?.category || 'Multiple'} sectors for your region.`,
            suggestions: [
                'Deploy quick-response teams based on regional hotspot density.',
                'Review departmental workload for your district.',
                'Compare cross-district efficiency metrics.',
            ],
        };
        return {
            users: userRoleCounts,
            statusDistribution: statusCounts,
            categoryDistribution: categoryCounts,
            dailyTrends: formattedTrends,
            severityDistribution: severityCounts,
            departmentActivity: deptActivity.map((d) => ({
                name: d.name,
                _count: { complaints: d._count.complaints },
            })),
            aiInsights,
        };
    }
    async getAiStats() {
        const totalComplaints = await this.prisma.complaint.count();
        const aiProcessed = await this.prisma.complaint.count({
            where: { NOT: { aiAnalysis: null } },
        });
        const duplicates = await this.prisma.complaint.count({
            where: { isDuplicate: true },
        });
        const spamRejected = await this.prisma.complaint.count({
            where: { status: client_1.ComplaintStatus.REJECTED, spamScore: { gt: 0.5 } },
        });
        const autoRouted = await this.prisma.complaint.count({
            where: { status: client_1.ComplaintStatus.IN_PROGRESS, NOT: { assignedToId: null } },
        });
        return {
            totalComplaints,
            aiProcessed,
            duplicates,
            spamRejected,
            autoRouted,
            averageConfidence: 0.92,
            deptDistribution: {
                Roads: 45,
                Water: 32,
                Sanitation: 28,
                Others: 15,
            },
            severityStats: {
                Critical: 12,
                High: 25,
                Medium: 45,
                Low: 18,
            },
        };
    }
    async triggerAiProcess() {
        const unprocessedComplaints = await this.prisma.complaint.findMany({
            where: { aiAnalysis: null },
            take: 20,
        });
        const AI_SERVICE_URL = this.configService.get('aiService.url');
        const results = [];
        for (const complaint of unprocessedComplaints) {
            try {
                const aiResponse = await fetch(`${AI_SERVICE_URL}/process-workflow`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        complaint_id: complaint.ticketId,
                        text: complaint.description,
                        latitude: complaint.latitude,
                        longitude: complaint.longitude,
                    }),
                });
                if (aiResponse.ok) {
                    const aiResult = await aiResponse.json();
                    await this.prisma.complaint.update({
                        where: { id: complaint.id },
                        data: {
                            aiAnalysis: {
                                category: aiResult.analysis.category,
                                reasoning: aiResult.analysis.reasoning,
                                confidence: aiResult.analysis.confidence,
                                eta_days: aiResult.eta_days,
                            },
                            category: aiResult.analysis.category,
                            status: aiResult.status === 'REJECTED_SPAM'
                                ? client_1.ComplaintStatus.REJECTED
                                : aiResult.assigned_officer
                                    ? client_1.ComplaintStatus.IN_PROGRESS
                                    : complaint.status,
                            assignedToId: aiResult.assigned_officer || complaint.assignedToId,
                            spamScore: aiResult.is_spam ? 1.0 : 0.0,
                            isDuplicate: aiResult.is_duplicate || false,
                        },
                    });
                    results.push({ id: complaint.id, status: 'SUCCESS' });
                }
            }
            catch (err) {
                results.push({ id: complaint.id, status: 'ERROR', error: err.message });
            }
        }
        return {
            message: `Processed ${unprocessedComplaints.length} complaints.`,
            results,
        };
    }
    async getDepartments() {
        return this.prisma.department.findMany({
            include: {
                head: { select: { id: true, name: true, email: true } },
                _count: { select: { complaints: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createDepartment(data) {
        const { name, headId } = data;
        const existing = await this.prisma.department.findUnique({
            where: { name: name.trim() },
        });
        if (existing)
            throw new common_1.BadRequestException('Department already exists');
        return this.prisma.department.create({
            data: { name: name.trim(), headId: headId || null },
            include: {
                head: { select: { id: true, name: true, email: true } },
                _count: { select: { complaints: true } },
            },
        });
    }
    async updateDepartment(id, data) {
        const { name, headId } = data;
        const conflict = await this.prisma.department.findFirst({
            where: { name: name.trim(), NOT: { id } },
        });
        if (conflict)
            throw new common_1.BadRequestException('A department with this name already exists');
        return this.prisma.department.update({
            where: { id },
            data: { name: name.trim(), headId: headId || null },
            include: {
                head: { select: { id: true, name: true, email: true } },
                _count: { select: { complaints: true } },
            },
        });
    }
    async deleteDepartment(id) {
        const dept = await this.prisma.department.findUnique({
            where: { id },
            include: { _count: { select: { complaints: true } } },
        });
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        if (dept._count.complaints > 0) {
            throw new common_1.BadRequestException(`Cannot delete: ${dept._count.complaints} complaints are linked to this department. Reassign them first.`);
        }
        await this.prisma.department.delete({ where: { id } });
        return { success: true, message: 'Department deleted' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(audit_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map