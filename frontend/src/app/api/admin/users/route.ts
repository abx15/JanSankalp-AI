import { userController } from "@/modules/user/user.controller";

export async function GET(req: Request) {
  return userController.getAllUsers(req);
}

export async function POST(req: Request) {
  return userController.handleAdminUserActionFromBody(req);
}
