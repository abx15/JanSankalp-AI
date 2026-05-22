import { userRepository } from "./user.repository";
import { AppError } from "@/core/error-handler";

export class UserService {
    async getProfile(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }

    async updateProfile(userId: string, data: any) {
        return userRepository.update(userId, data);
    }

    async listUsers(filter: any = {}) {
        return userRepository.getAllUsers(filter);
    }

    async deleteUser(userId: string) {
        return userRepository.delete(userId);
    }

    async handleAdminAction(targetUserId: string, action: string, data: any, sessionUser: any) {
        const targetUser = await userRepository.findById(targetUserId);
        if (!targetUser) {
            throw new AppError("User not found", 404);
        }

        if (sessionUser.id === targetUserId) {
            throw new AppError("Cannot modify your own account", 400);
        }

        let result;

        switch (action) {
            case 'block':
                result = await userRepository.update(targetUserId, { emailVerified: null });
                break;
            case 'unblock':
                result = await userRepository.update(targetUserId, { emailVerified: new Date() });
                break;
            case 'verify_email':
                result = await userRepository.update(targetUserId, { emailVerified: new Date() });
                break;
            case 'unverify_email':
                result = await userRepository.update(targetUserId, { emailVerified: null });
                break;
            case 'make_admin':
                result = await userRepository.update(targetUserId, { role: 'ADMIN' });
                break;
            case 'make_officer':
                result = await userRepository.update(targetUserId, { role: 'OFFICER' });
                break;
            case 'make_citizen':
                result = await userRepository.update(targetUserId, { role: 'CITIZEN' });
                break;
            case 'update_profile':
                const { name, phone, address, points } = data;
                result = await userRepository.update(targetUserId, {
                    ...(name && { name }),
                    ...(phone && { phone }),
                    ...(address && { address }),
                    ...(points !== undefined && { points: parseInt(points) })
                });
                break;
            case 'delete':
                if (targetUser.role === 'ADMIN') {
                    throw new AppError("Cannot delete admin users", 400);
                }
                await userRepository.delete(targetUserId);
                result = { success: true };
                break;
            default:
                throw new AppError("Invalid action", 400);
        }

        // Real-time triggers
        try {
            const { pusherServer } = await import("@/lib/pusher");
            if (action === 'delete') {
                await pusherServer.trigger("governance-channel", "user-deleted", { userId: targetUserId });
            } else {
                await pusherServer.trigger("governance-channel", "user-updated", { userId: targetUserId });
            }
        } catch (err) {
            console.error("NOTIFY_ERROR:", err);
        }

        return result;
    }
}

export const userService = new UserService();
