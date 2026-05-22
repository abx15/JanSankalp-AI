import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
    });
  }

  async validate(payload: any) {
    // payload should contain sub (userId)
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
        stateId: true,
        districtId: true,
        cityId: true,
        wardId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }
}
