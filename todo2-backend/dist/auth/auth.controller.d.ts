import { AuthService } from './auth.service';
import { CustomJwtService } from 'src/jwt/custom-jwt.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly customJwtService;
    constructor(authService: AuthService, customJwtService: CustomJwtService);
    register(firstName: string, lastName: string, email: string, password: string): Promise<import("../user/user.entity").User>;
    verifyToken(req: any): {
        isValid: boolean;
    };
    login(email: string, password: string, response: Response): Promise<Response<any, Record<string, any>>>;
}
