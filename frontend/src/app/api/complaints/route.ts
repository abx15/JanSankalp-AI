import { complaintController } from "@/modules/complaints/complaint.controller";

export async function GET(req: Request) {
    return complaintController.getComplaints(req);
}

export async function POST(req: Request) {
    return complaintController.createComplaint(req);
}
