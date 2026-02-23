import { NextResponse } from "next/server";
import { userService } from "./user.service";
import { auth } from "@/auth";
import { handleError, AppError } from "@/core/error-handler";

export class UserController {
    async getProfile(req: Request) {
        try {
            const session = await auth();
            if (!session?.user?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const user = await userService.getProfile(session.user.id);
            return NextResponse.json(user);
        } catch (error) {
            return handleError(error);
        }
    }

    async updateProfile(req: Request) {
        try {
            const session = await auth();
            if (!session?.user?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const user = await userService.updateProfile(session.user.id, body);
            return NextResponse.json(user);
        } catch (error) {
            return handleError(error);
        }
    }

    async getAllUsers(req: Request) {
        try {
            const session = await auth();
            const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "CITY_ADMIN"];
            if (!session || !allowedRoles.includes(session.user?.role || "")) {
                throw new AppError("Forbidden: Admin access required", 403);
            }

            const { searchParams } = new URL(req.url);
            const search = searchParams.get("search");
            const role = searchParams.get("role");

            const filter: any = {};
            if (role && role !== "all") {
                filter.role = role;
            }
            if (search) {
                filter.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }

            const users = await userService.listUsers(filter);
            return NextResponse.json({ users });
        } catch (error) {
            return handleError(error);
        }
    }

    async deleteUser(req: Request, { params }: { params: { id: string } }) {
        try {
            const session = await auth();
            const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "CITY_ADMIN"];
            if (!session || !allowedRoles.includes(session.user?.role || "")) {
                throw new AppError("Forbidden: Admin access required", 403);
            }

            await userService.deleteUser(params.id);
            return NextResponse.json({ success: true, message: "User deleted" });
        } catch (error) {
            return handleError(error);
        }
    }

    async getById(req: Request, { params }: { params: { id: string } }) {
        try {
            const session = await auth();
            const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "CITY_ADMIN"];
            if (!session || !allowedRoles.includes(session.user?.role || "")) {
                throw new AppError("Forbidden: Admin access required", 403);
            }

            const user = await userService.getProfile(params.id);
            return NextResponse.json({ user });
        } catch (error) {
            return handleError(error);
        }
    }

    async handleAdminUserAction(req: Request, { params }: { params: { id: string } }) {
        try {
            const session = await auth();
            const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "CITY_ADMIN"];
            if (!session || !allowedRoles.includes(session.user?.role || "")) {
                throw new AppError("Forbidden: Admin access required", 403);
            }

            const body = await req.json();
            const result = await userService.handleAdminAction(params.id, body.action, body, session.user);

            return NextResponse.json({
                message: body.action === 'delete' ? 'User deleted successfully' : 'User updated successfully',
                user: body.action === 'delete' ? undefined : result
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async handleAdminUserActionFromBody(req: Request) {
        try {
            const session = await auth();
            const allowedRoles = ["ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN", "CITY_ADMIN"];
            if (!session || !allowedRoles.includes(session.user?.role || "")) {
                throw new AppError("Forbidden: Admin access required", 403);
            }

            const body = await req.json();
            const { userId, action } = body;

            if (!userId || !action) {
                throw new AppError("User ID and action are required", 400);
            }

            const result = await userService.handleAdminAction(userId, action, body, session.user);

            return NextResponse.json({
                message: action === 'delete' ? 'User deleted successfully' : 'User updated successfully',
                user: action === 'delete' ? undefined : result
            });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const userController = new UserController();
