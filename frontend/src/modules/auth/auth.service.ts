import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository";
import { SignupRequest, ForgotPasswordRequest, VerifyOTPRequest } from "./auth.schema";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { pusherServer } from "@/lib/pusher";
import { AppError } from "@/core/error-handler";

export class AuthService {
    async signup(data: SignupRequest) {
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new AppError("User already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await authRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "CITIZEN",
        });

        // Trigger real-time update for admins
        await pusherServer.trigger("governance-channel", "user-registered", {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }).catch(err => console.error("Pusher trigger error:", err));

        // Generate OTP and send email
        const { token } = await generateVerificationToken(user.email);
        const emailResult = await sendVerificationEmail(user.email, token);

        if (!emailResult.success) {
            return {
                success: true,
                message: "User created but failed to send verification email. Please request a new code.",
                user,
                warning: "Email delivery failed",
                debug: process.env.NODE_ENV === 'development' ? { token } : undefined
            };
        }

        return {
            success: true,
            message: "Verification email sent",
            user
        };
    }

    async forgotPassword(data: ForgotPasswordRequest) {
        const user = await authRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("No account found with this email address", 404);
        }

        const { token } = await generatePasswordResetToken(data.email);
        const emailResult = await sendPasswordResetEmail(data.email, token);

        if (!emailResult.success) {
            if (process.env.NODE_ENV === 'development') {
                return {
                    message: 'OTP sent (check server console in dev mode)',
                    debug: { otp: token }
                };
            }
            throw new AppError("Failed to send OTP email", 500);
        }

        return { message: "OTP sent to your email successfully" };
    }

    async verifyOTP(data: VerifyOTPRequest) {
        const storedToken = await authRepository.findResetToken(data.email, data.token);

        if (!storedToken) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        if (new Date() > new Date(storedToken.expires)) {
            await authRepository.deleteResetToken(storedToken.id);
            throw new AppError("OTP has expired", 400);
        }

        const resetToken = Buffer.from(`${data.email}:${storedToken.id}:${Date.now()}`).toString('base64');
        await authRepository.deleteResetToken(storedToken.id);

        // Store reset token temporarily
        (global as any).resetTokenStorage = (global as any).resetTokenStorage || new Map();
        (global as any).resetTokenStorage.set(data.email, {
            resetToken,
            userId: (await authRepository.findByEmail(data.email))?.id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });

        return { resetToken };
    }

    async resetPassword(data: any) {
        const { email, resetToken, newPassword } = data;

        // Get reset token from temporary storage
        (global as any).resetTokenStorage = (global as any).resetTokenStorage || new Map();
        const storedResetData = (global as any).resetTokenStorage.get(email);

        if (!storedResetData || storedResetData.resetToken !== resetToken) {
            throw new AppError("Invalid or expired reset token. Please verify your OTP again.", 400);
        }

        if (new Date() > storedResetData.expiresAt) {
            (global as any).resetTokenStorage.delete(email);
            throw new AppError("Reset session has expired. Please start over.", 400);
        }

        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await authRepository.updateUser(user.id, {
            password: hashedPassword,
        });

        // Clean up reset token
        (global as any).resetTokenStorage.delete(email);

        return updatedUser;
    }

    async verifyEmail(data: { email: string; token: string }) {
        const verificationToken = await authRepository.findVerificationToken(data.email, data.token);

        if (!verificationToken) {
            throw new AppError("Invalid verification code", 400);
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();
        if (hasExpired) {
            throw new AppError("Verification code has expired", 400);
        }

        const user = await authRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await authRepository.updateUser(user.id, {
            emailVerified: new Date(),
        });

        await authRepository.deleteVerificationToken(verificationToken.id);

        return { success: true };
    }

    async resendVerification(email: string) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.emailVerified) {
            throw new AppError("Email already verified", 400);
        }

        const { token } = await generateVerificationToken(email);
        const emailResult = await sendVerificationEmail(email, token);

        if (!emailResult.success) {
            throw new AppError("Failed to send verification email", 500);
        }

        return { success: true };
    }

    async findUserByEmail(email: string) {
        return authRepository.findByEmail(email);
    }
}

export const authService = new AuthService();
