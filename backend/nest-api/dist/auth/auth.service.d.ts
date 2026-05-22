import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(credentials: any): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            points: number;
            stateId: string;
            districtId: string;
            cityId: string;
            wardId: string;
        };
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    private generateTokens;
}
