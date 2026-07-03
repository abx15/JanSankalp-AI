"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const { email, password, name, role } = data;
        const existing = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email address already registered');
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || client_1.Role.CITIZEN,
                emailVerified: role === 'ADMIN' ? new Date() : null,
            },
        });
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            ...tokens,
        };
    }
    async login(credentials) {
        const { email, password } = credentials;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid email or password credentials');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid email or password credentials');
        }
        if (user.role !== client_1.Role.ADMIN && !user.emailVerified) {
            throw new common_1.UnauthorizedException('Email verification pending');
        }
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                stateId: user.stateId,
                districtId: user.districtId,
                cityId: user.cityId,
                wardId: user.wardId,
            },
            ...tokens,
        };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User session no longer valid');
            }
            const tokens = await this.generateTokens(user.id);
            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                ...tokens,
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Refresh token has expired or is invalid');
        }
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 3600 * 1000);
        await this.prisma.verificationToken.deleteMany({
            where: { email },
        });
        await this.prisma.verificationToken.create({
            data: { email, token, expires },
        });
        const nodeServicesUrl = process.env.NODE_SERVICES_URL || 'http://node-services:3001';
        const emailSubject = 'Verify your email - JanSankalp AI';
        const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Verify your email</h2>
        <p style="color: #64748b;">Welcome to JanSankalp AI. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 1 hour.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #3b82f6;">${token}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `;
        console.log(`[AUTH-VERIFICATION] Dispatching verification OTP ${token} to ${email} via node-services...`);
        try {
            await fetch(`${nodeServicesUrl}/utils/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    subject: emailSubject,
                    html: emailHtml,
                    userId: user.id,
                }),
            });
        }
        catch (err) {
            console.error('[AUTH-VERIFICATION] Failed to dispatch email via node-services:', err.message);
        }
        return { success: true, message: 'Verification email resent successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map