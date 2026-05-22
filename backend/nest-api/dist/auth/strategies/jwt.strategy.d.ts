import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        points: number;
        stateId: string;
        districtId: string;
        cityId: string;
        wardId: string;
    }>;
}
export {};
