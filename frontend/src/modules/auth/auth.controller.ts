import { NextResponse } from "next/server";
import { authService } from "./auth.service";
import { signupSchema, forgotPasswordSchema, verifyOTPSchema } from "./auth.schema";
import { handleError, AppError } from "@/core/error-handler";

export class AuthController {
    async signup(req: Request) {
        try {
            const body = await req.json();
            const validation = signupSchema.safeParse(body);

            if (!validation.success) {
                throw new AppError("Invalid input data", 400);
            }

            const result = await authService.signup(validation.data);

            return NextResponse.json({
                success: true,
                message: result.message,
                email: result.user.email,
                warning: result.warning,
                debug: result.debug
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async forgotPassword(req: Request) {
        try {
            const body = await req.json();
            const validation = forgotPasswordSchema.safeParse(body);

            if (!validation.success) {
                throw new AppError("Invalid email address", 400);
            }

            const result = await authService.forgotPassword(validation.data);
            return NextResponse.json(result);
        } catch (error) {
            return handleError(error);
        }
    }

    async verifyOTP(req: Request) {
        try {
            const body = await req.json();
            const validation = verifyOTPSchema.safeParse(body);

            if (!validation.success) {
                throw new AppError("Invalid OTP or email", 400);
            }

            const result = await authService.verifyOTP(validation.data);
            return NextResponse.json({
                message: 'OTP verified successfully',
                resetToken: result.resetToken
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async resetPassword(req: Request) {
        try {
            const body = await req.json();
            const { email, resetToken, newPassword } = body;

            if (!email || !resetToken || !newPassword) {
                throw new AppError("Email, reset token, and new password are required", 400);
            }

            if (newPassword.length < 8) {
                throw new AppError("Password must be at least 8 characters long", 400);
            }

            const updatedUser = await authService.resetPassword({ email, resetToken, newPassword });

            return NextResponse.json({
                message: 'Password reset successfully',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                },
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async verifyEmail(req: Request) {
        try {
            const body = await req.json();
            const { email, token } = body;

            if (!email || !token) {
                throw new AppError("Email and token are required", 400);
            }

            await authService.verifyEmail({ email, token });
            return NextResponse.json({ success: true, message: "Email verified successfully" });
        } catch (error) {
            return handleError(error);
        }
    }

    async resendVerification(req: Request) {
        try {
            const body = await req.json();
            const { email } = body;

            if (!email) {
                throw new AppError("Email is required", 400);
            }

            await authService.resendVerification(email);
            return NextResponse.json({ success: true, message: "Verification email resent" });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const authController = new AuthController();
