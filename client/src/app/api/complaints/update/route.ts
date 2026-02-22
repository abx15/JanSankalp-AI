import { complaintController } from "@/modules/complaints/complaint.controller";

export async function PUT(req: Request) {
    return complaintController.updateStatus(req);
}
