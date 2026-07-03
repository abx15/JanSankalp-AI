import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const { email, password, name, role } = data;
    
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new BadRequestException('Email address already registered');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: (role as Role) || Role.CITIZEN,
        emailVerified: role === 'ADMIN' ? new Date() : null, // Auto-verify admin for dev convenience
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

  async login(credentials: any) {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    // Verify email (except system admins)
    if (user.role !== Role.ADMIN && !user.emailVerified) {
      throw new UnauthorizedException('Email verification pending');
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

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User session no longer valid');
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
    } catch (err) {
      throw new UnauthorizedException('Refresh token has expired or is invalid');
    }
  }

  private async generateTokens(userId: string) {
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

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate random 6-digit OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Delete existing token
    await this.prisma.verificationToken.deleteMany({
      where: { email },
    });

    // Create verification token
    await this.prisma.verificationToken.create({
      data: { email, token, expires },
    });

    // Dispatch email via node-services
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
    } catch (err: any) {
      console.error('[AUTH-VERIFICATION] Failed to dispatch email via node-services:', err.message);
    }

    return { success: true, message: 'Verification email resent successfully' };
  }
}
