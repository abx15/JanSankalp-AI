import { complaintController } from "@/modules/complaints/complaint.controller";

export async function POST(req: Request) {
    return complaintController.assign(req);
}
