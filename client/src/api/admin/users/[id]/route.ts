import { userController } from "@/modules/user/user.controller";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  return userController.getById(req, context);
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  return userController.handleAdminUserAction(req, context);
}
