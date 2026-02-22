import { userController } from "@/modules/user/user.controller";

export async function GET(req: Request) {
    return userController.getProfile(req);
}

export async function PATCH(req: Request) {
    return userController.updateProfile(req);
}
