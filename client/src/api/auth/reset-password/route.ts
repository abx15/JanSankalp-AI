import { authController } from "@/modules/auth/auth.controller";

export async function POST(req: Request) {
  return authController.resetPassword(req);
}
