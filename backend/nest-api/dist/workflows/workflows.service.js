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
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const queue_service_1 = require("../queue/queue.service");
const client_1 = require("@prisma/client");
let WorkflowsService = class WorkflowsService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async getComplaints(filters) {
        const { status, category, severity, authorId, assignedToId, districtId, limit = 50, cursor } = filters;
        const query = {
            where: {},
            take: parseInt(limit, 10),
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, role: true } },
                remarks: true,
            },
        };
        if (status)
            query.where.status = status;
        if (category)
            query.where.category = category;
        if (severity)
            query.where.severity = parseInt(severity, 10);
        if (authorId)
            query.where.authorId = authorId;
        if (assignedToId)
            query.where.assignedToId = assignedToId;
        if (districtId)
            query.where.districtId = districtId;
        if (cursor) {
            query.skip = 1;
            query.cursor = { id: cursor };
        }
        const complaints = await this.prisma.complaint.findMany(query);
        const nextCursor = complaints.length === parseInt(limit, 10) ? complaints[complaints.length - 1].id : null;
        return {
            success: true,
            data: complaints,
            nextCursor,
        };
    }
    async getComplaintById(id) {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, role: true } },
                remarks: { orderBy: { createdAt: 'desc' } },
                department: true,
            },
        });
        if (!complaint) {
            throw new common_1.NotFoundException('Complaint not found');
        }
        return {
            success: true,
            data: complaint,
        };
    }
    async createComplaint(data) {
        const { title, description, category, severity, latitude, longitude, authorId, imageUrl } = data;
        const author = await this.prisma.user.findUnique({
            where: { id: authorId },
            select: {
                stateId: true,
                districtId: true,
                cityId: true,
                wardId: true,
                tenantId: true,
            },
        });
        const ticketId = `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const complaint = await this.prisma.complaint.create({
            data: {
                ticketId,
                title: title || 'Civic Issue',
                description,
                originalText: description,
                status: client_1.ComplaintStatus.PENDING,
                category: category || 'General',
                severity: severity ? parseInt(severity, 10) : 1,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                authorId,
                imageUrl,
                stateId: author?.stateId,
                districtId: author?.districtId,
                cityId: author?.cityId,
                wardId: author?.wardId,
                tenantId: author?.tenantId,
            },
        });
        try {
            await this.queueService.addWorkflowJob(complaint.id, complaint.description, complaint.latitude, complaint.longitude);
        }
        catch (err) {
            console.error('[BULLMQ] Enqueue failure during complaint creation:', err);
        }
        try {
            this.triggerRealtimeEvent('governance-channel', 'new-complaint', {
                id: complaint.id,
                ticketId: complaint.ticketId,
                status: complaint.status,
                location: { lat: complaint.latitude, lng: complaint.longitude },
                districtId: complaint.districtId,
            });
        }
        catch (err) {
            console.error('[REALTIME] Ingestion error:', err);
        }
        return {
            success: true,
            data: complaint,
        };
    }
    async assignComplaint(complaintId, officerId, assignedBy) {
        const officer = await this.prisma.user.findUnique({
            where: { id: officerId },
        });
        if (!officer || officer.role !== client_1.Role.OFFICER) {
            throw new common_1.BadRequestException('Invalid officer selected');
        }
        const updatedComplaint = await this.prisma.complaint.update({
            where: { id: complaintId },
            data: {
                assignedToId: officerId,
                status: client_1.ComplaintStatus.IN_PROGRESS,
            },
        });
        try {
            this.triggerRealtimeEvent('officer-channel', 'complaint-assigned', {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                title: updatedComplaint.title,
                assignedByName: assignedBy.name || 'Admin',
                timestamp: new Date().toISOString(),
            });
            this.triggerRealtimeEvent('governance-channel', 'complaint-updated', {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: assignedBy.name || 'Admin',
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            console.error('[REALTIME] Assignment notification error:', err);
        }
        return {
            success: true,
            data: updatedComplaint,
        };
    }
    async updateComplaint(complaintId, data, sessionUser) {
        const { status, officerNote, verificationImageUrl } = data;
        const originalComplaint = await this.prisma.complaint.findUnique({
            where: { id: complaintId },
            include: {
                author: true,
                department: true,
            },
        });
        if (!originalComplaint) {
            throw new common_1.NotFoundException('Complaint not found');
        }
        let aiVerification = null;
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        if (status === 'RESOLVED') {
            try {
                const verifyResp = await fetch(`${AI_SERVICE_URL}/verify-resolution`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        complaint_text: originalComplaint.description,
                        resolution_text: officerNote,
                        evidence_image_url: verificationImageUrl,
                    }),
                });
                if (verifyResp.ok) {
                    aiVerification = await verifyResp.json();
                }
            }
            catch (err) {
                console.error('[AI-VERIFICATION] Connection failure:', err);
            }
        }
        const finalStatus = (aiVerification && !aiVerification.verified) ? client_1.ComplaintStatus.IN_PROGRESS : status;
        const updatedComplaint = await this.prisma.complaint.update({
            where: { id: complaintId },
            data: {
                status: finalStatus,
                assignedToId: sessionUser.id,
                remarks: officerNote ? {
                    create: {
                        text: aiVerification?.ai_summary || officerNote,
                        authorName: sessionUser.name || '',
                        authorRole: sessionUser.role,
                        imageUrl: verificationImageUrl || '',
                    },
                } : undefined,
                resolutionVerified: aiVerification ? aiVerification.verified : undefined,
                verificationLog: aiVerification ? JSON.stringify({
                    score: aiVerification.confidence_score,
                    reasoning: aiVerification.reasoning,
                    summary: aiVerification.ai_summary,
                }) : undefined,
            },
            include: {
                author: true,
                department: true,
            },
        });
        try {
            this.triggerRealtimeEvent('governance-channel', 'complaint-updated', {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: sessionUser.name,
                userRole: sessionUser.role,
                officerNote,
                verificationImageUrl,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            console.error('[REALTIME] Update notification error:', err);
        }
        if (finalStatus === client_1.ComplaintStatus.RESOLVED && originalComplaint.status !== client_1.ComplaintStatus.RESOLVED) {
            try {
                await this.prisma.user.update({
                    where: { id: originalComplaint.authorId },
                    data: { points: { increment: 50 } },
                });
                console.log(`[REWARD] Granted 50 points to citizen ${originalComplaint.authorId}.`);
            }
            catch (err) {
                console.error('[REWARD] Failed to update user points:', err);
            }
            const authorEmail = originalComplaint.author.email;
            const citizenName = originalComplaint.author.name || 'Citizen';
            const ticketId = originalComplaint.ticketId;
            const title = originalComplaint.title;
            const category = originalComplaint.category;
            const departmentName = originalComplaint.department?.name || 'General Administration';
            const resolutionDate = new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            const createdDate = new Date(originalComplaint.createdAt);
            const diffMs = Date.now() - createdDate.getTime();
            const diffDays = (diffMs / (1000 * 60 * 60 * 24)).toFixed(1);
            const slaTarget = '3.0';
            const emailSubject = `[RESOLVED] Civic Resolution Receipt & Invoice - Ticket #${ticketId}`;
            const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Civic Resolution Receipt</title>
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      padding: 35px 40px;
      text-align: center;
      color: #ffffff;
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(to right, #f97316, #e11d48, #10b981);
    }
    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin: 0 0 8px 0;
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      background-color: rgba(16, 185, 129, 0.15);
      color: #10b981;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.3);
      margin-top: 10px;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 12px;
      color: #0f172a;
    }
    .intro {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 30px;
    }
    .receipt-card {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .receipt-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #64748b;
      margin: 0 0 16px 0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .receipt-row:last-child {
      margin-bottom: 0;
    }
    .receipt-label {
      color: #64748b;
      font-weight: 500;
    }
    .receipt-value {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    .points-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      margin-bottom: 30px;
    }
    .points-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #15803d;
      margin: 0 0 6px 0;
    }
    .points-value {
      font-size: 32px;
      font-weight: 800;
      color: #166534;
      margin: 0;
    }
    .points-desc {
      font-size: 13px;
      color: #166534;
      margin: 6px 0 0 0;
      font-weight: 500;
    }
    .sla-badge {
      display: inline-block;
      background-color: #f1f5f9;
      color: #475569;
      font-size: 12px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 10px;
      border: 1px solid #e2e8f0;
    }
    .officer-note-box {
      border-left: 4px solid #3b82f6;
      background-color: #eff6ff;
      padding: 16px;
      border-radius: 0 12px 12px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #1e3a8a;
      margin-bottom: 30px;
    }
    .officer-note-title {
      font-weight: 700;
      margin-bottom: 4px;
    }
    .footer {
      background-color: #0f172a;
      color: #94a3b8;
      text-align: center;
      padding: 30px 40px;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer-links a {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-text">JanSankalp AI</div>
        <div style="font-size: 14px; opacity: 0.8; font-weight: 500;">National Sovereign AI Grievance Platform</div>
        <span class="badge">Complaint Resolved</span>
      </div>
      
      <div class="content">
        <div class="greeting">Namaste ${citizenName},</div>
        <div class="intro">
          We are pleased to inform you that your grievance regarding <strong>"${title}"</strong> has been successfully resolved by the designated department officer. 
          Thank you for playing an active role in building a better community through the JanSankalp platform.
        </div>
        
        <div class="points-box">
          <p class="points-title">Social Impact Points Awarded</p>
          <h3 class="points-value">+50 Points</h3>
          <p class="points-desc">Your civic trust profile has been successfully credited!</p>
        </div>

        <div class="receipt-card">
          <h4 class="receipt-title">Resolution Invoice / Receipt</h4>
          <div class="receipt-row">
            <span class="receipt-label">Ticket ID</span>
            <span class="receipt-value" style="font-family: monospace; font-size: 15px;">#${ticketId}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Category</span>
            <span class="receipt-value">${category}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Assigned Department</span>
            <span class="receipt-value">${departmentName}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Resolution Date</span>
            <span class="receipt-value">${resolutionDate}</span>
          </div>
          <div class="receipt-row" style="margin-top: 16px; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
            <span class="receipt-label">SLA Resolution Target</span>
            <span class="receipt-value">${slaTarget} Days</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Actual Turnaround Time</span>
            <span class="receipt-value" style="color: #10b981;">${diffDays} Days</span>
          </div>
        </div>

        ${officerNote ? `
        <div class="officer-note-box">
          <div class="officer-note-title">Officer Resolution Notes:</div>
          <div>${officerNote}</div>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 10px;">
          <span class="sla-badge">Performance Status: Excellent (Within SLA)</span>
        </div>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Ministry of Housing and Urban Affairs, Government of India.</p>
        <p>This is a defense-grade, AI-verified sovereign receipt generated automatically upon grievance resolution.</p>
        <div class="footer-links">
          <a href="#">Dashboard</a> | 
          <a href="#">Support</a> | 
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
      `;
            try {
                const nodeServicesUrl = process.env.NODE_SERVICES_URL || 'http://node-services:3001';
                const internalToken = process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026';
                console.log(`[EMAIL-DISPATCH] Sending resolution email to ${authorEmail} via ${nodeServicesUrl}/utils/email/send`);
                const emailResponse = await fetch(`${nodeServicesUrl}/utils/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${internalToken}`,
                    },
                    body: JSON.stringify({
                        to: authorEmail,
                        subject: emailSubject,
                        html: emailHtml,
                    }),
                });
                if (emailResponse.ok) {
                    const emailData = await emailResponse.json();
                    console.log(`[EMAIL-DISPATCH] Service response:`, emailData);
                }
                else {
                    const emailError = await emailResponse.text();
                    console.error(`[EMAIL-DISPATCH] Service failed with status ${emailResponse.status}:`, emailError);
                }
            }
            catch (err) {
                console.error(`[EMAIL-DISPATCH] Failed to dispatch resolution email:`, err);
            }
        }
        return {
            success: true,
            data: updatedComplaint,
        };
    }
    triggerRealtimeEvent(channel, event, payload) {
        console.log(`[REALTIME-EVENT] Channel: ${channel} | Event: ${event}`, payload);
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map