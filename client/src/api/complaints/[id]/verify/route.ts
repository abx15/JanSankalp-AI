import { complaintController } from "@/modules/complaints/complaint.controller";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    return complaintController.verify(req, params.id);
}
