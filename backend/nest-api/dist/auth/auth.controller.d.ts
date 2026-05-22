import { AuthService } from './auth.service';
import { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any, res: Response): Promise<{
        success: boolean;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        accessToken: string;
    }>;
    login(body: any, res: Response): Promise<{
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
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getSession(req: any): Promise<{
        success: boolean;
        user: any;
    }>;
    private setCookies;
}
