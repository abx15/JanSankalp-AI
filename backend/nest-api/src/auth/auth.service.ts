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
}
