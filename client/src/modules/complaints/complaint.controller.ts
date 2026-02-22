import { NextResponse } from "next/server";
import { complaintService } from "./complaint.service";
import { createComplaintSchema } from "./complaint.schema";
import { handleError, AppError } from "@/core/error-handler";
import { getTenantFilter } from "@/lib/rbac";
import { auth } from "@/auth";

export class ComplaintController {
    async getComplaints(req: Request) {
        try {
            const session = await auth();
            if (!session || !session.user) {
                throw new AppError("Unauthorized", 401);
            }

            const tenantFilter = getTenantFilter(session.user as any);
            const complaints = await complaintService.getAllComplaints(tenantFilter);
            return NextResponse.json({ complaints });
        } catch (error) {
            return handleError(error);
        }
    }

    async createComplaint(req: Request) {
        try {
            const body = await req.json();
            const validation = createComplaintSchema.safeParse(body);

            if (!validation.success) {
                throw new AppError("Invalid input data", 400);
            }

            const complaint = await complaintService.createComplaint(validation.data);

            return NextResponse.json({
                message: "Complaint registered successfully and is being processed by AI.",
                ticketId: complaint.ticketId,
                status: "PENDING",
                region: complaint.districtId || "Global"
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async assign(req: Request) {
        try {
            const session = await auth();
            if (!session || session.user?.role !== "ADMIN") {
                throw new AppError("Forbidden: Admin only", 403);
            }

            const { complaintId, officerId } = await req.json();
            if (!complaintId || !officerId) {
                throw new AppError("Complaint ID and Officer ID are required", 400);
            }

            const result = await complaintService.assignComplaint(complaintId, officerId, session.user.name || "Admin");

            return NextResponse.json({
                success: true,
                complaint: result.complaint,
                assignedOfficer: result.officer
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async updateStatus(req: Request) {
        try {
            const session = await auth();
            if (!session || (session.user?.role !== "OFFICER" && session.user?.role !== "ADMIN")) {
                throw new AppError("Forbidden: Restricted access", 403);
            }

            const body = await req.json();
            const { complaintId } = body;

            if (!complaintId) {
                throw new AppError("Complaint ID is required", 400);
            }

            const complaint = await complaintService.updateComplaint(complaintId, body, session.user);

            return NextResponse.json({
                success: true,
                complaint
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async verify(req: Request, id: string) {
        try {
            const session = await auth();
            if (!session || session.user?.role !== "ADMIN") {
                throw new AppError("Forbidden: Admin only", 403);
            }

            const { status } = await req.json();
            const updatedComplaint = await complaintService.verifyComplaint(id, status, session.user);

            return NextResponse.json(updatedComplaint);
        } catch (error) {
            return handleError(error);
        }
    }

    async updateStatusById(req: Request, id: string) {
        try {
            const session = await auth();
            if (!session || (session.user?.role !== "OFFICER" && session.user?.role !== "ADMIN")) {
                throw new AppError("Forbidden: Restricted access", 403);
            }

            const body = await req.json();
            const { status } = body;

            if (!status) {
                throw new AppError("Status is required", 400);
            }

            const complaint = await complaintService.updateComplaintSimple(id, status, session.user);

            return NextResponse.json({ complaint });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const complaintController = new ComplaintController();
